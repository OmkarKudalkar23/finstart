"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Calendar,
  User,
  Globe,
  Database
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface AMLDecision {
  id: string;
  userId: string;
  timestamp: Date;
  overallDecision: "approve" | "reject" | "manual_review";
  confidence: number; // 0-100
  riskScore: number; // 0-100
  
  // Rule triggers
  triggeredRules: {
    ruleId: string;
    ruleName: string;
    category: "sanctions" | "pep" | "adverse_media" | "watchlist" | "behavioral";
    severity: "low" | "medium" | "high" | "critical";
    confidence: number;
    details: string;
    evidence?: any[];
  }[];
  
  // Decision factors
  decisionFactors: {
    identityVerification: {
      documentAuthenticity: number;
      ocrConfidence: number;
      faceMatch: number;
    };
    behavioralAnalysis: {
      completionTime: number;
      deviceConsistency: boolean;
      locationConsistency: boolean;
      typingPattern: number;
    };
    riskIndicators: {
      amlScore: number;
      fraudProbability: number;
      politicallyExposedPerson: boolean;
      sanctionsHit: boolean;
    };
  };
  
  // Audit trail
  auditTrail: {
    timestamp: Date;
    action: string;
    actor: string;
    details: string;
    systemGenerated: boolean;
  }[];
  
  // Reviewer actions
  reviewerActions?: {
    reviewerId: string;
    reviewerName: string;
    action: "uphold" | "override" | "escalate";
    reasoning: string;
    timestamp: Date;
  }[];
}

interface ExplainableAMLProps {
  decisions: AMLDecision[];
  onExport?: (decision: AMLDecision, format: "pdf" | "json") => void;
  className?: string;
}

const RULE_CATEGORIES = {
  sanctions: { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
  pep: { color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  adverse_media: { color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
  watchlist: { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
  behavioral: { color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" }
};

const SEVERITY_LEVELS = {
  low: { color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
  medium: { color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  high: { color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
  critical: { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" }
};

export function ExplainableAMLDecisions({ decisions, onExport, className }: ExplainableAMLProps) {
  const [expandedDecisions, setExpandedDecisions] = useState<Set<string>>(new Set());
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const filteredDecisions = useMemo(() => {
    if (!filterCategory) return decisions;
    return decisions.filter(decision => 
      decision.triggeredRules.some(rule => rule.category === filterCategory)
    );
  }, [decisions, filterCategory]);

  const toggleDecision = (decisionId: string) => {
    setExpandedDecisions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(decisionId)) {
        newSet.delete(decisionId);
      } else {
        newSet.add(decisionId);
      }
      return newSet;
    });
  };

  const toggleRule = (ruleId: string) => {
    setExpandedRules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ruleId)) {
        newSet.delete(ruleId);
      } else {
        newSet.add(ruleId);
      }
      return newSet;
    });
  };

  const exportDecision = (decision: AMLDecision, format: "pdf" | "json") => {
    if (onExport) {
      onExport(decision, format);
    } else {
      // Default export behavior
      const data = JSON.stringify(decision, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aml-decision-${decision.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Explainable AML/KYC Decisions</h2>
          <p className="text-white/60 mt-1">Complete audit trail with rule triggers and confidence scores</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSensitiveData(!showSensitiveData)}
            className="text-white/60 hover:text-white"
          >
            {showSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showSensitiveData ? "Hide" : "Show"} Sensitive
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filterCategory === null ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setFilterCategory(null)}
          className={cn(
            filterCategory === null ? "bg-primary text-white" : "text-white/60 hover:text-white"
          )}
        >
          All Categories
        </Button>
        {Object.entries(RULE_CATEGORIES).map(([category, styles]) => (
          <Button
            key={category}
            variant={filterCategory === category ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilterCategory(category)}
            className={cn(
              filterCategory === category ? `${styles.bg} ${styles.color} border ${styles.border}` : "text-white/60 hover:text-white"
            )}
          >
            {category.replace("_", " ").toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Decisions List */}
      <div className="space-y-4">
        {filteredDecisions.map((decision) => (
          <Card key={decision.id} className="bg-black/40 border-white/10">
            <div className="p-6">
              {/* Decision Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {decision.overallDecision === "approve" && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                    {decision.overallDecision === "reject" && <XCircle className="w-5 h-5 text-red-400" />}
                    {decision.overallDecision === "manual_review" && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                    <span className="font-semibold text-white capitalize">
                      {decision.overallDecision.replace("_", " ")}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    ID: {decision.id}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Risk: {decision.riskScore}/100
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Confidence: {decision.confidence}%
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => exportDecision(decision, "json")}
                    className="text-white/60 hover:text-white"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleDecision(decision.id)}
                    className="text-white/60 hover:text-white"
                  >
                    {expandedDecisions.has(decision.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Timestamp and User */}
              <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {decision.timestamp.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  User: {showSensitiveData ? decision.userId : "••••••••"}
                </div>
                {decision.triggeredRules.length > 0 && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {decision.triggeredRules.length} rule{decision.triggeredRules.length !== 1 ? "s" : ""} triggered
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedDecisions.has(decision.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-white/10 space-y-6">
                      
                      {/* Triggered Rules */}
                      {decision.triggeredRules.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Triggered Rules
                          </h4>
                          <div className="space-y-3">
                            {decision.triggeredRules.map((rule) => (
                              <div key={rule.ruleId} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                                <div 
                                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                                  onClick={() => toggleRule(rule.ruleId)}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={cn(
                                      "px-2 py-1 rounded text-xs font-medium border",
                                      RULE_CATEGORIES[rule.category].bg,
                                      RULE_CATEGORIES[rule.category].color,
                                      RULE_CATEGORIES[rule.category].border
                                    )}>
                                      {rule.category.toUpperCase()}
                                    </div>
                                    <span className="text-white font-medium">{rule.ruleName}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className={cn(
                                      "px-2 py-1 rounded text-xs font-medium border",
                                      SEVERITY_LEVELS[rule.severity].bg,
                                      SEVERITY_LEVELS[rule.severity].color,
                                      SEVERITY_LEVELS[rule.severity].border
                                    )}>
                                      {rule.severity.toUpperCase()}
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {rule.confidence}% confidence
                                    </Badge>
                                    {expandedRules.has(rule.ruleId) ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                                  </div>
                                </div>
                                
                                <AnimatePresence>
                                  {expandedRules.has(rule.ruleId) && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="border-t border-white/10 p-3 space-y-2"
                                    >
                                      <p className="text-sm text-white/80">{rule.details}</p>
                                      {rule.evidence && rule.evidence.length > 0 && (
                                        <div className="mt-2">
                                          <p className="text-xs text-white/60 mb-1">Evidence:</p>
                                          <div className="bg-black/40 rounded p p-2 text-xs font-mono text-white/60">
                                            {JSON.stringify(rule.evidence, null, 2)}
                                          </div>
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Decision Factors */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Database className="w-4 h-4" />
                          Decision Factors
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          
                          {/* Identity Verification */}
                          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                            <h5 className="text-xs font-medium text-white/60 mb-2">Identity Verification</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-white/40">Document Authenticity</span>
                                <span className="text-xs font-medium text-white">{decision.decisionFactors.identityVerification.documentAuthenticity}%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-white/40">OCR Confidence</span>
                                <span className="text-xs font-medium text-white">{decision.decisionFactors.identityVerification.ocrConfidence}%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-white/40">Face Match</span>
                                <span className="text-xs font-medium text-white">{decision.decisionFactors.identityVerification.faceMatch}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Behavioral Analysis */}
                          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                            <h5 className="text-xs font-medium text-white/60 mb-2">Behavioral Analysis</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-white/40">Completion Time</span>
                                <span className="text-xs font-medium text-white">{decision.decisionFactors.behavioralAnalysis.completionTime}s</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-white/40">Device Consistency</span>
                                <span className={cn(
                                  "text-xs font-medium",
                                  decision.decisionFactors.behavioralAnalysis.deviceConsistency ? "text-green-400" : "text-red-400"
                                )}>
                                  {decision.decisionFactors.behavioralAnalysis.deviceConsistency ? "Pass" : "Fail"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-white/40">Location Consistency</span>
                                <span className={cn(
                                  "text-xs font-medium",
                                  decision.decisionFactors.behavioralAnalysis.locationConsistency ? "text-green-400" : "text-red-400"
                                )}>
                                  {decision.decisionFactors.behavioralAnalysis.locationConsistency ? "Pass" : "Fail"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Risk Indicators */}
                          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                            <h5 className="text-xs font-medium text-white/60 mb-2">Risk Indicators</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-white/40">AML Score</span>
                                <span className="text-xs font-medium text-white">{decision.decisionFactors.riskIndicators.amlScore}/100</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-white/40">Fraud Probability</span>
                                <span className="text-xs font-medium text-white">{decision.decisionFactors.riskIndicators.fraudProbability}%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-white/40">PEP Status</span>
                                <span className={cn(
                                  "text-xs font-medium",
                                  decision.decisionFactors.riskIndicators.politicallyExposedPerson ? "text-amber-400" : "text-green-400"
                                )}>
                                  {decision.decisionFactors.riskIndicators.politicallyExposedPerson ? "Yes" : "No"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Audit Trail */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Audit Trail
                        </h4>
                        <div className="space-y-2">
                          {decision.auditTrail.map((entry, index) => (
                            <div key={index} className="flex items-center gap-3 text-xs p-2 bg-white/5 rounded">
                              <span className="text-white/40">{entry.timestamp.toLocaleTimeString()}</span>
                              <span className="text-white/60">{entry.action}</span>
                              <span className="text-white/40">by {entry.actor}</span>
                              {entry.systemGenerated && (
                                <Badge variant="outline" className="text-xs">System</Badge>
                              )}
                              <span className="text-white/40 flex-1">{entry.details}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Reviewer Actions */}
                      {decision.reviewerActions && decision.reviewerActions.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-3">Reviewer Actions</h4>
                          <div className="space-y-2">
                            {decision.reviewerActions.map((action, index) => (
                              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-white">{action.reviewerName}</span>
                                    <Badge variant="outline" className={cn(
                                      "text-xs",
                                      action.action === "uphold" && "text-green-400",
                                      action.action === "override" && "text-amber-400",
                                      action.action === "escalate" && "text-red-400"
                                    )}>
                                      {action.action.toUpperCase()}
                                    </Badge>
                                  </div>
                                  <span className="text-xs text-white/40">{action.timestamp.toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-white/60">{action.reasoning}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        ))}
      </div>

      {filteredDecisions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/60">No decisions found for the selected criteria</p>
        </div>
      )}
    </div>
  );
}
