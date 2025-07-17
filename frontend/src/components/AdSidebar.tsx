import { useEffect } from "react"

export default function AdSidebar() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [])

  return (
    <div style={{ width: "100%" }}>
      <div style={{ /* background: "#111",*/ padding: "12px", borderRadius: "8px", width: "100%" }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", minHeight: 600 }}
          data-ad-client="ca-pub-6259480611340403"
          data-ad-slot="2332313933"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  )
}
