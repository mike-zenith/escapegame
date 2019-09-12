module.exports = {
  transform: {
    ".*\.ts$": "ts-jest"
  },
  testRegex: "/tests/.*(\\.|/)test\\.ts$",
  testPathIgnorePatterns: ["/dist/", "/node_modules/"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  collectCoverage: false,
}