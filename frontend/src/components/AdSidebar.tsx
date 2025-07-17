import { useEffect } from "react"

type AdSidebarProps = {
  size?: "default" | "footer"
}

export default function AdSidebar({ size = "default" }: AdSidebarProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [])

  const minHeight = size === "footer" ? 60 : 600

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          background: "#111",
          padding: "12px",
          borderRadius: "8px",
          width: "100%",
        }}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", minHeight }}
          data-ad-client="ca-pub-6259480611340403"
          data-ad-slot="2332313933"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  )
}
