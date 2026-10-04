"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { endpoints } from "@/lib/api/endpoints";
import { knowledgeKeys } from "@/lib/api/keys";
import { useUrlParams } from "@/lib/use-url-params";

const PAGE = 10;
const MAX = 25;
const MIN_CHARS = 2;
const TYPING_DELAY = 350;

/**
 * The search (?q=&drug=&section=) lives in the URL, so a lookup is linkable and the back button works.
 * Typing searches after a short pause; Enter searches at once. A drug on its own browses that drug's sections.
 */
export function useKnowledgeSearch() {
  const { params, update } = useUrlParams();
  const q = params.get("q") ?? "";
  const drug = params.get("drug") ?? "";
  const section = params.get("section") ?? "";
  const [text, setText] = useState(q);
  const [seenQ, setSeenQ] = useState(q);
  // Follow the URL when it changes from outside (back button, example chip), but never rewrite what is being typed.
  if (q !== seenQ) {
    setSeenQ(q);
    if (q !== text.trim()) setText(q);
  }

  useEffect(() => {
    const next = text.trim();
    if (next === q || (next.length > 0 && next.length < MIN_CHARS)) return;
    const timer = setTimeout(() => update({ q: next || null }), TYPING_DELAY);
    return () => clearTimeout(timer);
  }, [text, q, update]);

  const signature = [q, drug, section].join("|");
  const [more, setMore] = useState({ signature, on: false });
  const limit = more.signature === signature && more.on ? MAX : PAGE;

  const active = q.trim().length >= MIN_CHARS || drug !== "";
  const query = useQuery({
    queryKey: knowledgeKeys.search(q, drug, section, limit),
    queryFn: () =>
      endpoints.knowledgeSearch({
        q: q.trim().length >= MIN_CHARS ? q.trim() : undefined,
        drug: drug || undefined,
        section: section || undefined,
        limit,
      }),
    enabled: active,
    placeholderData: keepPreviousData,
  });
  const status = useQuery({
    queryKey: knowledgeKeys.status,
    queryFn: endpoints.knowledgeStatus,
    staleTime: 5 * 60_000,
  });
  const drugs = useQuery({
    queryKey: knowledgeKeys.drugs,
    queryFn: endpoints.knowledgeDrugs,
    staleTime: 5 * 60_000,
  });

  return {
    query,
    status,
    drugs,
    q,
    drug,
    section,
    active,
    text,
    setText,
    /** True while the text on screen is ahead of the search that produced the results. */
    settling: text.trim() !== q || (query.isFetching && query.isPlaceholderData),
    canShowMore: limit < MAX && (query.data?.has_more ?? false),
    showMore: () => setMore({ signature, on: true }),
    setDrug: (value: string) => update({ drug: value || null }, "push"),
    setSection: (value: string) => update({ section: value || null }),
    /** Searches a phrase at once, as the example chips and "did you mean" suggestions do. */
    searchFor: (value: string) => {
      setText(value);
      update({ q: value || null }, "push");
    },
    clear: () => {
      setText("");
      update({ q: null, drug: null, section: null }, "push");
    },
    submit: (event: FormEvent) => {
      event.preventDefault();
      update({ q: text.trim() || null }, "push");
    },
  };
}
