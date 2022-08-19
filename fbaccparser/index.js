const parseButtonElement = document.getElementById("parse_button");
const fileInputElement = document.getElementById("file_input");
const resultElement = document.getElementById("result");

const Notify = new XNotify("TopRight");

let accounts = [];

function startsWithNumber(str) {
  return /^\d/.test(str);
}

function copy(index, field) {
  const text = accounts[index][field];
  navigator.clipboard.writeText(text).then(
    function () {
      Notify.success({
        title: "Copied!",
        duration: 2000,
      });
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

parseButtonElement.onclick = () => {
  const file = fileInputElement.files[0];

  if (file) {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (e) => {
      resultElement.innerHTML = "";

      const fileContent = e.target.result;

      accounts = fileContent
        .split("\n")
        .filter((item) => startsWithNumber(item))
        .map((item) => {
          const cells = item.split("|");

          return {
            login: cells[0],
            password: cells[1],
            cookies: cells[12],
            agent: cells[13],
          };
        });

      accounts.forEach((account, index) => {
        resultElement.innerHTML += `
          <div class="account">
            <div class="account_number">${index + 1}.</div>
            <div class="cell" onClick="javascript:copy(${index}, 'login');">login: <span>${
          account.login
        }</span></div>
            <div class="cell" onClick="javascript:copy(${index}, 'password');">password: <span>${
          account.password
        }</span></div>
            <pre onClick="javascript:copy(${index}, 'cookies');">${
          account.cookies
        }</pre>
            <pre onClick="javascript:copy(${index}, 'agent');">${
          account.agent
        }</pre>
          </div>
        `;
      });
    };
    reader.onerror = (e) => {
      document.getElementById("fileContents").innerHTML = "error reading file";
    };
  }
};
