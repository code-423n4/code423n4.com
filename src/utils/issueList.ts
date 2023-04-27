export const issueTypes = [
  { uid: "tU2XavuSLCq", name: "Invalid Validation", color: "#0000FF" },
  { uid: "aK4fSQXXWig", name: "ERC20", color: "#FFA500" },
  { uid: "rcuFpDvxDfk", name: "ETH-Transfer", color: "#A52A2A" },
  { uid: "VHcjdVRVYMx", name: "Loop", color: "#FF0000" },
  { uid: "fcHqztWKAPa", name: "Token-Transfer", color: "#FF69B4" },
  { uid: "PwaapJAH7MH", name: "Payable", color: "#800080" },
  { uid: "qRzHkvZ3q3N", name: "Reentrancy", color: "#FFFF00" },
  { uid: "ZcM8MtLWXPR", name: "call/delegatecall", color: "#808080" },
  { uid: "4Vc5tQ77X6W", name: "GOX", color: "#FFFF00" },
  { uid: "Pi2p3mHdkwe", name: "Rug-Pull", color: "#800080" },
  { uid: "9uPT42zfK59", name: "CanAuto", color: "#A52A2A" },
  { uid: "C7VGXWMjSNt", name: "ERC721", color: "#808080" },
  { uid: "39DJcf6gnTB", name: "Oracle", color: "#008000" },
  { uid: "5u7f6PxVMdX", name: "DoS", color: "#800080" },
  { uid: "AvCnpdMxtZU", name: "Math", color: "#FFA500" },
  { uid: "s9viyuSdDPf", name: "Under/Overflow", color: "#FFA500" },
  { uid: "sTS52MfEieq", name: "Other", color: "#800080" },
  { uid: "QQthrzLz3YU", name: "Uniswap", color: "#FF69B4" },
  { uid: "xDAGbhvm8Ci", name: "MEV", color: "#FFA500" },
  { uid: "wvTJvmfQanE", name: "en/de-code", color: "#800080" },
  { uid: "kee5WSpUxLb", name: "Timing", color: "#A52A2A" },
  { uid: "mDXa8cfPPxD", name: "Decimal", color: "#FF69B4" },
  { uid: "FcYQv5CBiUA", name: "Upgradable", color: "#808080" },
  { uid: "uRGDLdPNAts", name: "ERC4626", color: "#800080" },
  { uid: "DmBWbW7i24W", name: "Governance", color: "#FF0000" },
  { uid: "QPNNCv84XyA", name: "Access Control", color: "#FFFF00" },
  { uid: "Ku7a94FLYkY", name: "Context", color: "#008000" },
  { uid: "yrwmfCkkwni", name: "Error", color: "#008000" },
  { uid: "xVV79K3nL9G", name: "Solmate", color: "#808080" },
  { uid: "VAhTnhtYNGQ", name: "Library", color: "#A52A2A" },
]
  .map((type) => {
    return {
      label: type.name,
      value: type.name,
    };
  })
  .sort((a, b) => a.label.localeCompare(b.label));
