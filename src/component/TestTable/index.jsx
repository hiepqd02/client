import axios from "axios";
import { useState, useEffect } from "react";
import { modules } from "../../data/modules";

function TestTable() {
  const [loading, setLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState();
  const [disableButton, setDisableButton] = useState([]);
  const [detailReport, setDetailReport] = useState();
  const [moduleData, setModuleData] = useState(modules);
  const moduleParams = modules.map((module) => module.param);

  const handleGetData = async () => {
    const response = await axios
      .post("http://localhost:5000/get-test-data", {
        moduleParams,
      })
      .then((response) => {
        const responseData = response.data;
        const updatedModuleData = modules.map((module, index) => {
          const data = responseData[index];
          return data ? { ...module, data } : module;
        });
        setModuleData(updatedModuleData);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRunTest = async (modulename) => {
    setIsExecuting(true);
    setDisableButton((arr) => [...arr, modulename]);
    const res = await axios.get(
      "http://localhost:5000/run-tests?module=" + modulename
    );
  };

  useEffect(() => {
    handleGetData();
  }, []);

  if (loading) {
    return <div>Loading</div>;
  }

  if (detailReport) {
    return (
      <div>
        <iframe
          src={"/details-rp" + detailReport}
          width="100%"
          height="1080"
        ></iframe>
      </div>
    );
  }

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th>Module</th>
            <th>Summary</th>
            <th>Details</th>
            <th>Last Update</th>
            <th>Run Test</th>
          </tr>
          {moduleData.map((module) => {
            console.log(module.data);
            return (
              <>
                {
                  <tr>
                    <td>{module.name}</td>
                    <td>
                      <p>
                        Passed:{" "}
                        {module.data.summary.passed
                          ? module.data.summary.passed
                          : 0}
                      </p>
                      <p>
                        Failed:{" "}
                        {module.data.summary.failed
                          ? module.data.summary.failed
                          : 0}
                      </p>
                      <p>
                        Skipped:{" "}
                        {module.data.summary.skipped
                          ? module.data.summary.skipped
                          : 0}
                      </p>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setDetailReport(module.pathToHtml);
                        }}
                      >
                        View Details
                      </button>
                    </td>
                    <td>
                      {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }).format(module.data.created * 1000)}
                    </td>
                    <td>
                      <button
                        onClick={() => handleRunTest(module.param)}
                        disabled={disableButton.includes(module.param)}
                      >
                        {disableButton.includes(module.param)
                          ? "Running..."
                          : "Run Test"}
                      </button>
                    </td>
                  </tr>
                }
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TestTable;
