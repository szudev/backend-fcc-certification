import { ChangeEvent, FormEvent, useState } from "react";
import FILE_UPLOAD_STATES, { FileUploadStateType } from "./context/states";
import Spinner from "./components/Spinner";
import UploadFile, { FileReturnFormat } from "./services/uploadFile";
import { toast } from "sonner";
import Button from "./components/Button";

function App() {
  const [data, setData] = useState<FileReturnFormat | undefined>(undefined);
  const [currentState, setCurrentState] = useState<FileUploadStateType>(
    FILE_UPLOAD_STATES.IDLE
  );
  const [currentFile, SetCurrentFile] = useState<File | null>(null);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [file] = e.target.files ?? [];
    if (file && currentState !== FILE_UPLOAD_STATES.UPLOADING) {
      if (file.size > 1048576) {
        toast.warning("The max size of the file is 1MB.");
        SetCurrentFile(null);
      } else {
        SetCurrentFile(file);
        setCurrentState(FILE_UPLOAD_STATES.READY_UPLOAD);
      }
    }
  };

  const handleReloadOnClick = () => {
    setCurrentState(FILE_UPLOAD_STATES.IDLE);
    SetCurrentFile(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentFile || currentState !== FILE_UPLOAD_STATES.READY_UPLOAD)
      return;
    setCurrentState(FILE_UPLOAD_STATES.UPLOADING);
    //call to the API
    const [error, json] = await UploadFile(currentFile);

    if (error) {
      toast.error(error.message);
      setCurrentState(FILE_UPLOAD_STATES.READY_UPLOAD);
      return;
    }

    if (json) {
      setCurrentState(FILE_UPLOAD_STATES.UPLOADED);
      setData(json);
      toast.success("File uploaded successfully");
      return;
    }

    toast.error("Unexpected error.");
  };

  //const disableInputCondition = currentState === FILE_UPLOAD_STATES.UPLOADING;
  //const disableSubmitCondition =
  currentState === (FILE_UPLOAD_STATES.IDLE || FILE_UPLOAD_STATES.UPLOADING);

  const BUTTOM_TEXT = {
    [FILE_UPLOAD_STATES.IDLE]: "Without file",
    [FILE_UPLOAD_STATES.UPLOADING]: "Uploading",
    [FILE_UPLOAD_STATES.READY_UPLOAD]: "Upload",
    [FILE_UPLOAD_STATES.UPLOADED]: "Upload",
  };

  return (
    <main className="min-h-[100svh] w-full gap-6 bg-black flex flex-col items-center justify-center p-4">
      <h1 className="text-white text-2xl text-center font-bold">
        API Project: File Metadata Microservice
      </h1>
      <section className="flex flex-col rounded-lg border border-slate-200 gap-6 items-center p-4">
        {currentState !== FILE_UPLOAD_STATES.UPLOADED ? (
          <>
            <h2 className="text-white text-lg font-bold">Upload a file</h2>
            <form
              className="flex flex-col gap-4 items-center"
              onSubmit={handleSubmit}
            >
              <input
                id="inputfield"
                className="block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                type="file"
                name="upfile"
                onChange={handleOnChange}
              />
              <Button
                id="button"
                type="submit"
                name="Upload"
                className="flex items-center disabled:pointer-events-none justify-center gap-2 disabled:cursor-not-allowed hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
              >
                {BUTTOM_TEXT[currentState]}{" "}
                {currentState === FILE_UPLOAD_STATES.UPLOADING ? (
                  <Spinner />
                ) : null}
              </Button>
            </form>{" "}
          </>
        ) : data ? (
          <>
            <h2 className="text-white text-lg font-bold">File data</h2>
            <pre className="text-white block">
              {JSON.stringify(data, undefined, 2)}
            </pre>
            <Button onClick={handleReloadOnClick}>Reupload</Button>
          </>
        ) : (
          <>
            <h2 className="text-white text-lg font-bold">Unexpected error</h2>
            <Button onClick={handleReloadOnClick}>Reload</Button>
          </>
        )}
      </section>
      <p className="text-white text-sm">
        By{" "}
        <a
          href="https://github.com/szudev"
          className="text-sm text-white/60 hover:underline hover:text-white"
        >
          szudev
        </a>
      </p>
    </main>
  );
}

export default App;
