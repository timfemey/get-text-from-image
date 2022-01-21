import { Fragment, h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { createWorker } from "tesseract.js";
import "../style/App.css";
//github: timfemey

function App() {
  const [text, setText] = useState(
    "Upload an Image and we will do the rest :)"
  );
  const [link, setLink] = useState(null);

  const worker = createWorker({
    logger: (m) => console.log(m),
  });

  const convert = async () => {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    setText("Loading....");
    const {
      data: { text },
    } = await worker.recognize(link);
    setText(text);
  };

  const imageInput = (event) => {
    const image = event.target.files[0];
    if (image) {
      const fileReader = new FileReader();
      fileReader.addEventListener("loadend", () => {
        const uri = fileReader.result;

        setLink(uri);
      });
      fileReader.readAsDataURL(image);
    } else {
      return alert("No Image Uploaded ");
    }
  };
  useEffect(() => {
    convert();
  }, [link]);

  return (
    <Fragment>
      <center>
        <input type="file" onChange={imageInput} accept="image/*" />
        <img src={link} alt="Image" />
        <p>{text}</p>
        <p>The better the image quality the better the results ;)</p>
      </center>
    </Fragment>
  );
}

export default App;
