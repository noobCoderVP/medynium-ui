"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/errors";
import { patientKeys, pendingKeys, reportKeys } from "@/lib/api/keys";

const WORKING = new Set(["UPLOADED", "PARSING"]);

export const errorText = (error: unknown) =>
  error instanceof ApiError ? error.message : "That did not work. Try again.";

/** The patient's reports. While one is being read the list refreshes itself every few seconds. */
export function useReports(patientId: string) {
  return useQuery({
    queryKey: reportKeys.list(patientId),
    queryFn: () => endpoints.reports(patientId),
    refetchInterval: (query) =>
      query.state.data?.items.some((r) => WORKING.has(r.status)) ? 3000 : false,
  });
}

export function useReport(patientId: string, reportId: string | null) {
  return useQuery({
    queryKey: reportKeys.one(patientId, reportId ?? ""),
    queryFn: () => endpoints.report(patientId, reportId ?? ""),
    enabled: reportId !== null,
  });
}

/** Upload, row decisions, approve and reject. Nothing reaches the record until a doctor approves. */
export function useReportActions(patientId: string) {
  const queryClient = useQueryClient();
  const refresh = (reportId?: string) => {
    void queryClient.invalidateQueries({ queryKey: reportKeys.list(patientId) });
    if (reportId)
      void queryClient.invalidateQueries({ queryKey: reportKeys.one(patientId, reportId) });
  };
  const upload = useMutation({
    mutationFn: (file: File) => endpoints.uploadReport(patientId, file),
    onSuccess: () => refresh(),
  });
  const decide = useMutation({
    mutationFn: (v: {
      reportId: string;
      rowId: string;
      decision: "accept" | "reject";
      version: number;
    }) => endpoints.decideRow(patientId, v.rowId, v.decision, v.version),
    onSuccess: (_data, v) => refresh(v.reportId),
  });
  const approve = useMutation({
    mutationFn: (v: { reportId: string; confirmIdentity: boolean }) =>
      endpoints.approveReport(patientId, v.reportId, v.confirmIdentity),
    onSuccess: (_data, v) => {
      refresh(v.reportId);
      // Approved rows change the record and what is pending.
      void queryClient.invalidateQueries({ queryKey: patientKeys.all });
      void queryClient.invalidateQueries({ queryKey: pendingKeys.all });
    },
  });
  const reject = useMutation({
    mutationFn: (reportId: string) => endpoints.rejectReport(patientId, reportId),
    onSuccess: (_data, reportId) => refresh(reportId),
  });
  return { upload, decide, approve, reject };
}
