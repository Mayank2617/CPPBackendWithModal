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
    exec("sudo apt update -y && sudo apt install -y python3 || sudo yum update -y && sudo yum install -y python3", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error installing Python on Linux/macOS: ${error}`);
            return;
        }
        console.log(stdout);
        console.error(stderr);
    });
}