export const thresholds = {
  // Soft warning thresholds used for report severity labels only.
  maxMissingRootSourceKeyPctWarn: 0.2,
  maxMissingRootSameAsPctWarn: 0.5,
  maxMissingItemLanguagePctWarn: 0.5,
  maxMissingItemAccessStatusPctWarn: 0.5,
  maxMissingManifestationSourceKeyPctWarn: 0.5,

  // Hard limits are informational right now and not enforced as failing assertions.
  maxDuplicateRootHandlesHard: 0,
  maxDuplicateRootKipHard: 0,
  maxDuplicateRootSameAsIdHard: 0,
};
