import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const archivoBlackBuffer = fs.readFileSync(
  path.join(process.cwd(), "public", "fonts", "ArchivoBlack-Regular.ttf")
);
const spaceMonoRegularBuffer = fs.readFileSync(
  path.join(process.cwd(), "public", "fonts", "SpaceMono-Regular.ttf")
);
const spaceMonoBoldBuffer = fs.readFileSync(
  path.join(process.cwd(), "public", "fonts", "SpaceMono-Bold.ttf")
);

const logoBuffer = fs.readFileSync(
  path.join(process.cwd(), "public", "brand", "logo-mark-black.png")
);
const logoDataUri = `data:image/png;base64,${logoBuffer.toString("base64")}`;

function formatCompactNumber(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === "") return "0";
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/[a-zA-Z#]/.test(trimmed)) return trimmed;
    const parsed = Number(trimmed);
    if (isNaN(parsed)) return trimmed;
    value = parsed;
  }
  const num = Number(value);
  if (isNaN(num)) return "0";
  if (num < 1000) return String(num);
  if (num < 1_000_000) {
    const k = num / 1000;
    return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
  }
  const m = num / 1_000_000;
  return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
}

function getTitleFontSize(title: string): number {
  const len = title.length;
  if (len <= 18) return 62;
  if (len <= 32) return 52;
  return 44;
}

function truncateDescription(desc: string, maxLen = 105): string {
  const clean = (desc || "").trim().replace(/\s+/g, " ");
  if (!clean) return "";
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen - 1).trim() + "…";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rawOwner = searchParams.get("owner") || "";
    const rawRepo = searchParams.get("repo") || "";
    const rawTitle = searchParams.get("title") || "";
    const rawDesc = searchParams.get("description") || searchParams.get("desc") || "";
    const rawStars = searchParams.get("stars");
    const rawForks = searchParams.get("forks");
    const rawRank = searchParams.get("rank");
    const rawUsername = searchParams.get("username") || searchParams.get("user") || "";
    const rawDomain = searchParams.get("domain") || "skills.biz.id";

    let owner = rawOwner.trim().replace(/^@/, "");
    let repo = rawRepo.trim();
    let displayTitle = rawTitle.trim();

    if (!displayTitle && owner && repo) {
      displayTitle = `${owner}/${repo}`;
    } else if (!displayTitle) {
      displayTitle = "PROSKILLAI / SKILLS";
    }

    if (!owner) {
      if (displayTitle.includes("/")) {
        const parts = displayTitle.split("/");
        owner = parts[0].trim();
        repo = parts.slice(1).join("/").trim();
      } else {
        owner = "proskillai";
        repo = displayTitle;
      }
    }

    const description = rawDesc.trim() ||
      "Supercharge your development workflow with curated AI agent skills, prompts, and MCP tools.";

    const formattedStars = formatCompactNumber(rawStars ?? "555.7k");
    const formattedForks = formatCompactNumber(rawForks ?? "52k");
    const formattedRank = rawRank ? (rawRank.startsWith("#") ? rawRank : `#${rawRank}`) : "#1";
    const username = rawUsername.trim()
      ? (rawUsername.trim().startsWith("@") ? rawUsername.trim() : `@${rawUsername.trim()}`)
      : null;
    const domain = rawDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");

    const requestedWidth = parseInt(searchParams.get("w") || "1200", 10);
    const requestedHeight = parseInt(searchParams.get("h") || "630", 10);

    const width = isNaN(requestedWidth) || requestedWidth <= 0 ? 1200 : requestedWidth;
    const height = isNaN(requestedHeight) || requestedHeight <= 0 ? 630 : requestedHeight;

    const scale = width / 1200;
    const baseTitleSize = getTitleFontSize(displayTitle);
    const titleSize = Math.round(baseTitleSize * scale);
    const descSize = Math.round(24 * scale);
    const truncatedDesc = truncateDescription(description, 110);

    const is16by9 = Math.abs(width / height - 16 / 9) < 0.05;
    const bodyMarginTop = is16by9 ? Math.round(28 * scale) : Math.round(20 * scale);
    const footerPaddingTop = is16by9 ? Math.round(22 * scale) : Math.round(18 * scale);

    return new ImageResponse(
      (
        <div
          style={{
            width,
            height,
            backgroundColor: "#FFD23F",
            position: "relative",
            display: "flex",
            fontFamily: "Space Mono",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: Math.round(40 * scale),
              left: Math.round(40 * scale),
              right: Math.round(56 * scale),
              bottom: Math.round(56 * scale),
              backgroundColor: "#FFFFFF",
              border: `${Math.round(6 * scale)}px solid #000000`,
              boxShadow: `${Math.round(16 * scale)}px ${Math.round(16 * scale)}px 0 #000000`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: `${Math.round(32 * scale)}px ${Math.round(40 * scale)}px`,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: Math.round(16 * scale),
                }}
              >
                <div
                  style={{
                    width: Math.round(72 * scale),
                    height: Math.round(72 * scale),
                    borderRadius: 9999,
                    border: `${Math.round(4 * scale)}px solid #000000`,
                    backgroundColor: "#FFD23F",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={logoDataUri}
                    width={Math.round(52 * scale)}
                    height={Math.round(52 * scale)}
                    style={{ objectFit: "contain" }}
                    alt="Logo"
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Archivo Black",
                      fontSize: Math.round(30 * scale),
                      color: "#000000",
                      lineHeight: 1.1,
                      letterSpacing: -0.5,
                    }}
                  >
                    ProSkillAI
                  </span>
                  <span
                    style={{
                      fontFamily: "Space Mono",
                      fontSize: Math.round(18 * scale),
                      color: "#000000",
                      lineHeight: 1.2,
                    }}
                  >
                    {domain}
                  </span>
                </div>
              </div>

              {username ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: Math.round(12 * scale),
                    backgroundColor: "#FF5CA8",
                    border: `${Math.round(4 * scale)}px solid #000000`,
                    boxShadow: `${Math.round(5 * scale)}px ${Math.round(5 * scale)}px 0 #000000`,
                    padding: `${Math.round(8 * scale)}px ${Math.round(18 * scale)}px`,
                  }}
                >
                  <div
                    style={{
                      width: Math.round(20 * scale),
                      height: Math.round(20 * scale),
                      borderRadius: 9999,
                      backgroundColor: "#000000",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "Space Mono",
                      fontWeight: 700,
                      fontSize: Math.round(20 * scale),
                      color: "#000000",
                    }}
                  >
                    {username}
                  </span>
                </div>
              ) : null}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: bodyMarginTop,
                flexGrow: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  backgroundColor: "#000000",
                  color: "#FFFFFF",
                  fontFamily: "Space Mono",
                  fontWeight: 700,
                  fontSize: Math.round(20 * scale),
                  padding: `${Math.round(6 * scale)}px ${Math.round(12 * scale)}px`,
                }}
              >
                {`by @${owner}`}
              </div>

              <div
                style={{
                  fontFamily: "Archivo Black",
                  fontSize: titleSize,
                  textTransform: "uppercase",
                  lineHeight: 1.05,
                  color: "#000000",
                  marginTop: Math.round(14 * scale),
                  marginBottom: Math.round(10 * scale),
                  display: "flex",
                }}
              >
                {displayTitle}
              </div>

              {truncatedDesc ? (
                <div
                  style={{
                    fontFamily: "Space Mono",
                    fontWeight: 700,
                    fontSize: descSize,
                    lineHeight: 1.35,
                    color: "#000000",
                    display: "flex",
                  }}
                >
                  {truncatedDesc}
                </div>
              ) : null}
            </div>

            <div
              style={{
                borderTop: `${Math.round(4 * scale)}px solid #000000`,
                paddingTop: footerPaddingTop,
                marginTop: "auto",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: Math.round(14 * scale),
                }}
              >
                <div
                  style={{
                    backgroundColor: "#FFD23F",
                    border: `${Math.round(4 * scale)}px solid #000000`,
                    boxShadow: `${Math.round(5 * scale)}px ${Math.round(5 * scale)}px 0 #000000`,
                    padding: `${Math.round(10 * scale)}px ${Math.round(18 * scale)}px`,
                    fontFamily: "Space Mono",
                    fontWeight: 700,
                    fontSize: Math.round(20 * scale),
                    color: "#000000",
                    display: "flex",
                  }}
                >
                  {`Stars: ${formattedStars}`}
                </div>

                <div
                  style={{
                    backgroundColor: "#5CE1E6",
                    border: `${Math.round(4 * scale)}px solid #000000`,
                    boxShadow: `${Math.round(5 * scale)}px ${Math.round(5 * scale)}px 0 #000000`,
                    padding: `${Math.round(10 * scale)}px ${Math.round(18 * scale)}px`,
                    fontFamily: "Space Mono",
                    fontWeight: 700,
                    fontSize: Math.round(20 * scale),
                    color: "#000000",
                    display: "flex",
                  }}
                >
                  {`Forks: ${formattedForks}`}
                </div>

                <div
                  style={{
                    backgroundColor: "#B6FF5C",
                    border: `${Math.round(4 * scale)}px solid #000000`,
                    boxShadow: `${Math.round(5 * scale)}px ${Math.round(5 * scale)}px 0 #000000`,
                    padding: `${Math.round(10 * scale)}px ${Math.round(18 * scale)}px`,
                    fontFamily: "Space Mono",
                    fontWeight: 700,
                    fontSize: Math.round(20 * scale),
                    color: "#000000",
                    display: "flex",
                  }}
                >
                  {`Rank: ${formattedRank}`}
                </div>
              </div>

              <span
                style={{
                  fontFamily: "Space Mono",
                  fontWeight: 700,
                  fontSize: Math.round(20 * scale),
                  color: "#000000",
                  textAlign: "right",
                  display: "flex",
                }}
              >
                {domain}
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width,
        height,
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
        fonts: [
          {
            name: "Archivo Black",
            data: archivoBlackBuffer,
            style: "normal",
            weight: 400,
          },
          {
            name: "Space Mono",
            data: spaceMonoRegularBuffer,
            style: "normal",
            weight: 400,
          },
          {
            name: "Space Mono",
            data: spaceMonoBoldBuffer,
            style: "normal",
            weight: 700,
          },
        ],
      }
    );
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            backgroundColor: "#FFD23F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Archivo Black",
            fontSize: 48,
            color: "#000000",
          }}
        >
          PROSKILLAI
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      }
    );
  }
}
