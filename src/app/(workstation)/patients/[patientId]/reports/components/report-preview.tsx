"use client";

import { Download, Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { errorText, useReportFile } from "../hooks/use-reports";

/** Preview button and modal for the original report file (PDF or image). The file is fetched only when opened. */
export function ReportPreview({
  patientId,
  reportId,
  filename,
}: {
  patientId: string;
  reportId: string;
  filename: string;
}) {
  const [open, setOpen] = useState(false);
  const query = useReportFile(patientId, reportId, open);
  const url = query.data?.url;
  const isImage = query.data?.isImage;
  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Eye aria-hidden="true" />
        Preview
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={filename}
        description="Original file, as uploaded."
        className="h-[85dvh] md:w-[min(56rem,calc(100vw-2rem))]"
      >
        <div className="flex h-full min-h-[60dvh] flex-col bg-muted/30">
          {query.isError ? (
            <div className="space-y-2 p-4 text-sm">
              <p role="alert" className="text-crit">
                {errorText(query.error)}
              </p>
              <Button size="sm" variant="outline" onClick={() => void query.refetch()}>
                Try again
              </Button>
            </div>
          ) : !url ? (
            <Skeleton className="m-4 h-full min-h-[50dvh]" />
          ) : isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={filename} className="mx-auto max-h-full object-contain p-4" />
          ) : (
            <iframe title={`Preview of ${filename}`} src={url} className="h-full w-full flex-1" />
          )}
          {url ? (
            <div className="flex justify-end border-t border-border bg-popover px-4 py-2">
              <Button size="sm" variant="outline" render={<a href={url} download={filename} />}>
                <Download aria-hidden="true" />
                Download
              </Button>
            </div>
          ) : null}
        </div>
      </Dialog>
    </>
  );
}
