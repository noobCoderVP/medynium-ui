"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { endpoints } from "@/lib/api/endpoints";
import { knowledgeKeys } from "@/lib/api/keys";
import { useUrlParams } from "@/lib/use-url-params";

/** The search (?q=&drug=&section=) lives in the URL, so a lookup is linkable. Searching starts on submit. */
export function useKnowledgeSearch() {
  const { params, update } = useUrlParams();
  const q = params.get("q") ?? "";
  const drug = params.get("drug") ?? "";
  const section = params.get("section") ?? "";
  const [text, setText] = useState(q);
  const [sectionText, setSectionText] = useState(section);

  const query = useQuery({
    queryKey: knowledgeKeys.search(q, drug, section),
    queryFn: () =>
      endpoints.knowledgeSearch({ q, drug: drug || undefined, section: section || undefined }),
    enabled: q.trim().length > 0,
  });
  const status = useQuery({
    queryKey: knowledgeKeys.status,
    queryFn: endpoints.knowledgeStatus,
    staleTime: 5 * 60_000,
  });

  return {
    query,
    status,
    q,
    drug,
    section,
    text,
    setText,
    setDrug: (value: string) => update({ drug: value || null }),
    sectionText,
    setSectionText,
    submit: (event: FormEvent) => {
      event.preventDefault();
      update({ q: text.trim() || null, section: sectionText.trim() || null }, "push");
    },
  };
}
