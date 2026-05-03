import React, { useEffect, useState } from "react";
import { get } from "./get";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
    const [responseString, setResponseString] = useState(null);

  

  // Simulating your backend response (string!)
    // const responseString = get("https://it25u6dfgh.execute-api.us-east-1.amazonaws.com/default/fn-upload")
  // let responseString = `{"uploadUrl":"https://fn-upload.s3.us-east-1.amazonaws.com/2026-05-03/2026-05-03T123524.662?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIARDXZ22GYDDDSYRRC%2F20260503%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260503T123524Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEI3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIHVxXYv3DM5zN1wLzwkrAm5HylEzV6GHLk4heMFyMCHPAiABJG5kFsNJXqadQBuePFTOeCttgeD8MOfbdqiy%2B0ClsirUAwhWEAIaDDA3Njc1OTYxNzk2OCIMy9CpzvTxZP4vKx%2BEKrEDui3RKQsp5Wudp11SD5D5eMnf23sZ9rHQbd2iTQHrhfwCB3x4Ia%2BjAFaZdMwifi%2F3G0ryaLdNUnv28a9%2FhV26SF0U95vXKb4%2FuU8evq3JMgUmNrWhpVNFdl%2Fdxg3OCOWU0mU1Hs%2FcQJkTnqRReh0XIZGer4VhXxO5qJnzZyP0olFoGUeUjVUNcTqRFItODcx%2B32oE14qugNqNW5cc6gP4C5sMoORePQE7sp%2BinBGgSlFiHUq%2FmxDSzrp%2FA29vX%2BKdpJpOf5tQSqupWR3VoTctHpTyEo7un4mykoCOXBnE%2FEYYMFDR9wG1CwYI7dZsm3xwJicKK60xCaBvTC4CDJ18OjxZkzptRQ%2F1aTWuaGX5ErjTRK5PHVE1wfM%2Ffb%2B%2BbUcy0lLpzHkRSDYSQbaHauWEJWR9Jwh1Bhz%2BzuoJwbqlW7vlA6cZcoKoDJAhnvBZHCfmJP4XRaz%2BjlS1n5cY3UE%2Bebf0OgBOoJ13GMpIU9kYndXhbmixSwPw1LqQe3DxhVy1hwxZwnW9yvolUIMoILRsPYGckH7gTb93Vc9QUk0eDwK6XN3pRIPRA94SbejluUyKVzC0%2FtzPBjqiARzvUNPoy86j7En9yd4Ke7q9jeGHynUxEwR5I50fpDFIJ4k8oCcrF5cAi%2Ffu0xdZqK0KlVYZqVPz3rvFstcd%2FfIj0nQqgH%2FOdjNJIUuB0uLmKtevNoagYJVEFgKA7O8FhU8uo%2Fs54H54GnWtfi1awJ6FqahEbeRv7aN00lchS0%2FGNUZ1QUf5XT75nHL1svEoZBW35K8b3N9Pt64OIyaY%2FH3fgA%3D%3D&X-Amz-Signature=945ea581781a445117c8187acfbb5749ee33d538ea929e9f9bb07c4f5b1054ca&X-Amz-SignedHeaders=host&x-amz-checksum-crc32=AAAAAA%3D%3D&x-amz-sdk-checksum-algorithm=CRC32&x-id=PutObject","fileKey":"2026-05-03/2026-05-03T123524.662"}`;

  let objectUrl = "https://fn-upload.s3.us-east-1.amazonaws.com";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await get(
          "https://it25u6dfgh.execute-api.us-east-1.amazonaws.com/default/fn-upload"
        );
        console.log("Loaded responseString:", res);

        setResponseString(res);
      } catch (err) {
        console.error("Failed to load responseString", err);
      }
    };

    load();
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    try {
      console.log("Using responseString:", responseString);
      // const { uploadUrl, fileKey } = JSON.parse(responseString);
      const uploadUrl = responseString.uploadUrl;
      const fileKey = responseString.fileKey;

      const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type, // important
        },
        body: file,
      });

      if (!res.ok) throw new Error("Upload failed");

      setStatus(`Uploaded: ${objectUrl}/${fileKey}`);
    } catch (err) {
      console.error(err);
      setStatus("Upload error");
    }
  };

  return (
    <div>
      <h3>Upload file</h3>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload}>Upload</button>

      <p>{status}</p>
    </div>
  );
}