import React, { useRef, useEffect, useState } from "react";
import { get } from "./get";
import { getExtension } from "./fn/getExtension";
import { AppLoading } from "./loading/AppLoading";
// import { useSearchParams } from "react-router-dom";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  const [responseString, setResponseString] = useState({
    signedUrl: "",
    file: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusDownload, setStatusDownload] = useState(false);

  const downloadRef = useRef(null);

  const API_URL =
    "https://it25u6dfgh.execute-api.us-east-1.amazonaws.com/default/fn-upload";

  // const [searchParams] = useSearchParams();
  // console.log("searchParams:", searchParams);
  // console.log("searchParams.file:", searchParams.get("file"));

  const uploadFileWithProgress = (signedUrl, file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", signedUrl);

      xhr.setRequestHeader("Content-Type", file.type);

      // upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);

          setProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error"));
      };

      xhr.send(file);
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setProgress(0);
      setStatus("");

      // get signed URL
      //let resp = await get(API_URL);
      let resp = await get(
        API_URL + "?cmd=put&file=" + getExtension(file.name),
      );

      setResponseString(resp);

      const signedUrl = resp.signedUrl;

      setFileName(resp.file);

      // upload with progress
      await uploadFileWithProgress(signedUrl, file);

      setStatus("Complete");
    } catch (err) {
      console.error(err);
      setStatus(":( " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!fileName) return;

    try {
      let resp = await get(API_URL + "?file=" + fileName + "&cmd=get");

      setResponseString(resp);
      setStatusDownload(true);

      setTimeout(() => {
        downloadRef.current?.click();
      }, 1000);
    } catch (err) {
      console.error(err);
      setStatus("Download error");
    }
  };

  useEffect(() => {
    const fn = new URLSearchParams(window.location.search).get("fn");
    console.log("fn:", fn);
    if (fn) {
      setFileName(fn);
      //TODO: if fn is not empty, call handleDownload
      //handleDownload();
    }
  }, []);

  return (
    <div>
      <div
        style={{
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #fff",
          borderRadius: "5px",
        }}
      >
        <h3>Upload</h3>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button onClick={handleUpload}>Upload</button>

        <p>{status}</p>

        {/* progress bar */}
        {loading && (
          <div>
            <progress value={progress} max="100" />
            {/* <p>{progress}%</p> */}
          </div>
        )}

        {loading && <AppLoading text={progress + "%"} />}
      </div>

      <div
        style={{
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #fff",
          borderRadius: "5px",
        }}
      >
        <h3>Download</h3>

        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />

        <button onClick={handleDownload}>Download</button>

        <br />
        <br />

        {statusDownload && (
          <a
            href={responseString.signedUrl}
            target="_blank"
            rel="noreferrer"
            style={{ backgroundColor: "#FFF" }}
            ref={downloadRef}
          >
            {responseString.file}
          </a>
        )}
      </div>

      <div style={{ color: "#222" }}>1.3.1</div>
    </div>
  );
}
