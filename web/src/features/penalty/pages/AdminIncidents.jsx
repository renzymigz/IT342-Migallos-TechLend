import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/features/admin/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { incidentsAPI } from "@/features/penalty/api/penaltyAPI";
import {
  ShieldCheck,
  AlertTriangle,
  PackageX,
  CheckCircle2,
  User,
  MessageSquare,
  BookmarkMinus,
} from "lucide-react";

export default function AdminIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [resolveTarget, setResolveTarget] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const remote = await incidentsAPI.getAll();
      if (!mounted) return;
      setIncidents(remote);
      setLoading(false);
    };
    load();
    return () => (mounted = false);
  }, []);

  const filtered = useMemo(() => {
    if (filter === "open") return incidents.filter((i) => !i.resolved);
    if (filter === "resolved") return incidents.filter((i) => i.resolved);
    return incidents;
  }, [incidents, filter]);

  const openCount = incidents.filter((i) => !i.resolved).length;
  const resolvedCount = incidents.filter((i) => i.resolved).length;

  const handleResolve = async () => {
    if (!resolveTarget) return;
    // optimistic update
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === resolveTarget.id ? { ...i, resolved: true } : i,
      ),
    );
    await incidentsAPI.resolveIncident(resolveTarget.id);
    setResolveTarget(null);
  };

  const handleUnsuspend = async (userId) => {
    // optimistic: remove suspensionReason from users in incidents list
    setIncidents((prev) =>
      prev.map((i) =>
        i.userId === userId ? { ...i, suspensionReason: null } : i,
      ),
    );
    await incidentsAPI.unsuspendUser(userId);
  };

  const handleModalConfirm = async () => {
    if (!resolveTarget) return;
    const isManual = resolveTarget.penaltyType === "manual_suspension";
    if (isManual) {
      // optimistic: remove manual suspension incidents for this user
      setIncidents((prev) =>
        prev.filter(
          (i) =>
            !(
              i.userId === resolveTarget.userId &&
              i.penaltyType === "manual_suspension"
            ),
        ),
      );
      await incidentsAPI.unsuspendUser(resolveTarget.userId);
      setResolveTarget(null);
      return;
    }

    // default: resolve penalty
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === resolveTarget.id ? { ...i, resolved: true } : i,
      ),
    );
    await incidentsAPI.resolveIncident(resolveTarget.id);
    setResolveTarget(null);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/15">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{openCount}</p>
              <p className="text-xs text-muted-foreground">Open Incidents</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {resolvedCount}
              </p>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15">
              <PackageX className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {incidents.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Tracked</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Filter:
          </span>
          <div className="flex gap-1.5">
            {[
              { value: "all", label: "All" },
              { value: "open", label: "Open" },
              { value: "resolved", label: "Resolved" },
            ].map((fb) => (
              <button
                key={fb.value}
                onClick={() => setFilter(fb.value)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === fb.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {fb.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">
            Loading incidents...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-16 text-center">
            <p className="text-sm font-medium text-foreground">
              No incidents found
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try changing the filter
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filtered.map((inc) => (
              <Card
                key={inc.id}
                className={`relative overflow-hidden transition-shadow hover:shadow-md ${!inc.resolved ? "border-l-4 border-l-destructive" : "border-l-4 border-l-emerald-600"}`}
              >
                <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/15">
                        <User className="h-4 w-4 text-destructive" />
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {inc.userName}
                      </div>
                      <StatusBadge status={inc.penaltyType} className="ml-2" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {inc.equipment} •{" "}
                      {new Date(inc.reportedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={inc.resolved ? "resolved" : "open"} />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 pt-0">
                  <div className="rounded-md border border-border bg-muted/40 p-3">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <MessageSquare className=" h-4 w-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Staff Remarks
                      </p>
                    </div>

                    <p className="text-sm text-foreground">
                      {inc.remarks?.trim() ? inc.remarks : "—"}
                    </p>
                    {inc.suspensionReason && (
                      <div className="mt-5 flex items-start justify-between gap-4">
                        <div>
                          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            <BookmarkMinus className="h-4 w-4 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              Suspension Reason
                            </p>
                          </div>

                          <p className="text-sm text-foreground">
                            {inc.suspensionReason}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full">
                    {!inc.resolved && (
                      <Button
                        onClick={() => setResolveTarget(inc)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog
          open={!!resolveTarget}
          onOpenChange={(open) => !open && setResolveTarget(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground">
                <ShieldCheck className="h-5 w-5 text-foreground" />
                {resolveTarget?.penaltyType === "manual_suspension"
                  ? "Unsuspend User"
                  : "Resolve Incident"}
              </DialogTitle>
              <DialogDescription>
                {resolveTarget?.penaltyType === "manual_suspension"
                  ? "This will lift the manual suspension for the user."
                  : "This will mark the incident as resolved and (optionally) lift any suspension on the user."}
              </DialogDescription>
            </DialogHeader>

            {resolveTarget && (
              <div className="rounded-md border border-border bg-muted/40 p-4">
                <p className="text-sm font-medium text-foreground">
                  {resolveTarget.userName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {resolveTarget.email}
                </p>
                <p className="mt-2 text-sm text-foreground">
                  {resolveTarget.remarks?.trim() ? resolveTarget.remarks : "—"}
                </p>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setResolveTarget(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleModalConfirm}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {resolveTarget?.penaltyType === "manual_suspension"
                  ? "Unsuspend"
                  : "Confirm Resolve"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
