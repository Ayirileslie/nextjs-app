"use client";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(""); // Reset response before making request

    try {
      const res = await fetch("https://fast-api-newsummarizer.onrender.com/process_url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      // If the response is not ok, display the error message
      if (!res.ok) {
        const errorData = await res.text(); // Get the error text for more details
        throw new Error(`Failed to fetch data: ${errorData}`);
      }

      // Parse the response and access the summary part
      const data = await res.json();
      const summaryText = data?.summary?.parts?.[0]?.text || "No result received from API";
      setResponse(summaryText);
    } catch (error) {
      setResponse(`Error processing the URL: ${error.message}`);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">BrevityAI</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input"
          placeholder="Enter URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
      <textarea
        className="textarea"
        value={response}
        readOnly
        placeholder="Processed result will appear here..."
      />
    </div>
  );
}
