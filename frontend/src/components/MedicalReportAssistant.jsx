import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  FileUp,
  LoaderCircle,
  MessageSquareText,
  ScanSearch,
  X,
} from "lucide-react";
import {
  askMedicalReports,
  getMedicalReports,
  uploadMedicalReport,
} from "../services/authApi";

const tabs = [
  { id: "upload", label: "Upload PDF", icon: FileUp },
  { id: "chat", label: "Chat", icon: MessageSquareText },
];

const ANSWERED_STATUS = "ANSWERED";

export default function MedicalReportAssistant({ open, onClose }) {
  const [activeTab, setActiveTab] = useState("upload");
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [answerPayload, setAnswerPayload] = useState(null);
  const [askError, setAskError] = useState("");

  const reportCountLabel = useMemo(() => {
    if (!reports.length) return "No reports uploaded yet";
    return `${reports.length} report${reports.length > 1 ? "s" : ""} available`;
  }, [reports]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadReports() {
      setReportsLoading(true);
      setReportsError("");
      try {
        const data = await getMedicalReports();
        if (!cancelled) {
          setReports(data);
        }
      } catch (error) {
        if (!cancelled) {
          setReportsError(error.message || "Unable to load reports right now.");
        }
      } finally {
        if (!cancelled) {
          setReportsLoading(false);
        }
      }
    }

    loadReports();
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setUploading(false);
      setUploadMessage("");
      setUploadError("");
      setQuestion("");
      setAsking(false);
      setAnswerPayload(null);
      setAskError("");
      setActiveTab("upload");
    }
  }, [open]);

  if (!open) return null;

  const refreshReports = async () => {
    setReportsLoading(true);
    setReportsError("");
    try {
      const data = await getMedicalReports();
      setReports(data);
    } catch (error) {
      setReportsError(error.message || "Unable to refresh reports.");
    } finally {
      setReportsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Choose a PDF before uploading.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadMessage("");
    try {
      const response = await uploadMedicalReport(selectedFile);
      setUploadMessage(`Stored ${response.originalFileName} successfully.`);
      setSelectedFile(null);
      await refreshReports();
      setActiveTab("chat");
    } catch (error) {
      setUploadError(error.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      setAskError("Enter a question to search your uploaded reports.");
      return;
    }

    setAsking(true);
    setAskError("");
    try {
      const response = await askMedicalReports(question.trim());
      setAnswerPayload(response);
    } catch (error) {
      setAskError(error.message || "Unable to generate an answer right now.");
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-blue-950/35 px-4 py-8 backdrop-blur-sm md:px-6 md:py-10">
      <div className="flex min-h-full items-center justify-center">
        <div className="flex max-h-[min(860px,calc(100vh-2rem))] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border-2 border-blue-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.22)] md:max-h-[calc(100vh-5rem)]">
        <div className="flex items-center justify-between border-b border-blue-100 bg-linear-to-r from-blue-50 via-cyan-50 to-blue-100 px-6 py-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-cyan-300 bg-white text-cyan-700">
                <ScanSearch className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-poppins text-xl font-bold text-blue-950">
                  Medical Report Summarizer
                </h2>
                <p className="text-sm font-medium text-slate-500">
                  Upload your reports, store them securely, and chat over your health records.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-blue-100 p-2 text-slate-500 transition-colors hover:bg-white hover:text-blue-900"
            aria-label="Close medical report assistant"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="overflow-y-auto border-b border-blue-100 bg-slate-50/70 p-5 lg:border-b-0 lg:border-r">
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">
                Reports
              </p>
              <p className="mt-2 text-sm font-semibold text-blue-950">{reportCountLabel}</p>
              {reportsLoading && (
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Loading your reports...
                </div>
              )}
              {reportsError && (
                <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                  {reportsError}
                </p>
              )}
            </div>

            <div className="mt-4 space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all ${
                    activeTab === id
                      ? "border-cyan-300 bg-white text-cyan-700 shadow-sm"
                      : "border-transparent bg-transparent text-slate-600 hover:border-blue-100 hover:bg-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-blue-100 bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">
                Recent files
              </p>
              <div className="mt-3 space-y-2">
                {reports.slice(0, 4).map((report) => (
                  <div
                    key={report.reportId}
                    className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
                  >
                    <p className="truncate text-sm font-semibold text-blue-950">
                      {report.originalFileName}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {report.processingStatus}
                    </p>
                  </div>
                ))}
                {!reportsLoading && !reports.length && (
                  <p className="text-sm text-slate-500">
                    Your uploaded reports will appear here once they are stored.
                  </p>
                )}
              </div>
            </div>
          </aside>

          <section className="min-h-0 overflow-y-auto p-6 md:p-7">
            {activeTab === "upload" ? (
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">
                    Upload PDF
                  </p>
                  <h3 className="mt-2 font-poppins text-2xl font-bold text-blue-950">
                    Store a new medical report
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Upload a PDF directly to your secure report vault. The backend will store it,
                    extract text, and prepare it for retrieval-augmented answers.
                  </p>
                </div>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-cyan-300 bg-cyan-50/60 px-6 py-12 text-center transition-colors hover:bg-cyan-50">
                  <FileUp className="h-10 w-10 text-cyan-700" />
                  <p className="mt-4 text-base font-bold text-blue-950">
                    {selectedFile ? selectedFile.name : "Choose a PDF report"}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Accepted format: PDF. The report will be saved and indexed for later chat.
                  </p>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(event) => {
                      const nextFile = event.target.files?.[0] || null;
                      setSelectedFile(nextFile);
                      setUploadError("");
                      setUploadMessage("");
                    }}
                  />
                </label>

                {uploadError && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {uploadError}
                  </p>
                )}
                {uploadMessage && (
                  <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {uploadMessage}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-950 px-5 py-3 text-sm font-bold tracking-wide text-white transition-all hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
                    Upload and Store
                  </button>
                  <button
                    onClick={() => setActiveTab("chat")}
                    className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-950 transition-colors hover:bg-blue-50"
                  >
                    <Bot className="h-4 w-4" />
                    Go to Chat
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">
                    Chat with Reports
                  </p>
                  <h3 className="mt-2 font-poppins text-2xl font-bold text-blue-950">
                    Ask questions over your stored reports
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Ask a grounded question and the assistant will answer only from the reports
                    already uploaded to your account.
                  </p>
                </div>

                <div className="rounded-[24px] border border-blue-100 bg-slate-50 p-4">
                  <textarea
                    value={question}
                    onChange={(event) => {
                      setQuestion(event.target.value);
                      setAskError("");
                    }}
                    rows={5}
                    placeholder="Example: Summarize my latest uploaded report and highlight the important findings."
                    className="w-full resize-none rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400"
                  />

                  {askError && (
                    <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {askError}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={handleAsk}
                      disabled={asking}
                      className="inline-flex items-center gap-2 rounded-2xl bg-blue-950 px-5 py-3 text-sm font-bold tracking-wide text-white transition-all hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {asking ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <MessageSquareText className="h-4 w-4" />
                      )}
                      Ask Assistant
                    </button>
                    <button
                      onClick={() => {
                        setQuestion("");
                        setAnswerPayload(null);
                        setAskError("");
                      }}
                      className="rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-950 transition-colors hover:bg-blue-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {answerPayload && (
                  <div className="space-y-4">
                    <div className="rounded-[24px] border border-cyan-200 bg-cyan-50/50 p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">
                        Answer
                      </p>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                        {answerPayload.answer}
                      </p>
                    </div>

                    {Array.isArray(answerPayload.summarySections) &&
                      answerPayload.summarySections.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">
                            Clinical Summary
                          </p>
                          <div className="grid gap-3 md:grid-cols-2">
                            {answerPayload.summarySections.map((section, index) => (
                              <div
                                key={`${section.title}-${index}`}
                                className="rounded-[22px] border border-blue-100 bg-white p-4 shadow-sm"
                              >
                                <p className="text-sm font-bold text-blue-950">{section.title}</p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                  {section.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {answerPayload.answerStatus === ANSWERED_STATUS &&
                      Array.isArray(answerPayload.supportingChunks) &&
                      answerPayload.supportingChunks.length > 0 && (
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">
                            Supporting Chunks
                          </p>
                          <div className="mt-3 space-y-3">
                            {answerPayload.supportingChunks.map((chunk, index) => (
                              <div
                                key={`${chunk.reportId}-${chunk.chunkIndex}-${index}`}
                                className="rounded-[22px] border border-blue-100 bg-white p-4 shadow-sm"
                              >
                                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                  <span>{chunk.originalFileName}</span>
                                  <span className="text-cyan-700">Chunk {chunk.chunkIndex + 1}</span>
                                </div>
                                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                  {chunk.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {answerPayload.answerStatus !== ANSWERED_STATUS && (
                      <div className="rounded-[22px] border border-blue-100 bg-white p-4 shadow-sm">
                        <p className="text-sm font-medium text-slate-600">
                          No directly supporting report excerpt was found for this question.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
      </div>
    </div>
  );
}
