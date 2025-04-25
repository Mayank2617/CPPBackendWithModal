const { exec } = require("child_process");
const os = require("os");

if (os.platform() === "win32") {
    console.log("Running post-install script for Windows...");
    exec(
        'powershell -Command "& {Invoke-WebRequest -Uri \"https://www.python.org/ftp/python/3.10.0/python-3.10.0-amd64.exe\" -OutFile \"python_installer.exe\"; Start-Process \"python_installer.exe\" -ArgumentList \"/quiet InstallAllUsers=1 PrependPath=1\" -Wait; Remove-Item \"python_installer.exe\"}"',
        (error, stdout, stderr) => {
            if (error) {
                console.error(`Error installing Python on Windows: ${error}`);
                return;
            }
            console.log(stdout);
            console.error(stderr);
        }
    );
} else {
    console.log("Running post-install script for Linux/macOS...");
    exec("apt update -y && apt install -y python3 || yum update -y && yum install -y python3", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error installing Python: ${error}`);
            return;
        }
        console.log(stdout);
        console.error(stderr);
    });
}

// "postinstall": "apt-get update && apt-get install -y python3 python3-pip"
// "postinstall": "node postinstall.js",