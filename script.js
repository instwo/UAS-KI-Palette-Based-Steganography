document
  .getElementById("encodeButton")
  .addEventListener("click", encodeMessage);
document
  .getElementById("decodeButton")
  .addEventListener("click", decodeMessage);
document
  .getElementById("downloadButton")
  .addEventListener("click", downloadImage);

function encodeMessage() {
  const imageInput = document.getElementById("imageInput").files[0];
  const message = document.getElementById("messageInput").value;

  if (!imageInput || !message) {
    alert("Please select an image and enter a message.");
    return;
  }

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const binaryMessage = messageToBinary(message);
      let messageIndex = 0;

      for (let i = 0; i < data.length; i += 4) {
        if (messageIndex < binaryMessage.length) {
          data[i] = (data[i] & 0xfe) | parseInt(binaryMessage[messageIndex]);
          messageIndex++;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      document.getElementById("downloadButton").style.display = "inline";
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(imageInput);
}

function decodeMessage() {
  const encodedImageInput =
    document.getElementById("encodedImageInput").files[0];

  if (!encodedImageInput) {
    alert("Please select an encoded image.");
    return;
  }

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let binaryMessage = "";

      for (let i = 0; i < data.length; i += 4) {
        binaryMessage += (data[i] & 1).toString();
      }

      const message = binaryToMessage(binaryMessage);
      const decodedMessageElement = document.getElementById("decodedMessage");
      decodedMessageElement.textContent = message;
      decodedMessageElement.classList.remove("hidden");

      // Adjust Palete position
      const palete = document.getElementById("Palete");
      palete.style.top = "10px";
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(encodedImageInput);
}

function messageToBinary(message) {
  return message
    .split("")
    .map((char) => {
      return char.charCodeAt(0).toString(2).padStart(8, "0");
    })
    .join("");
}

function binaryToMessage(binary) {
  let message = "";
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    message += String.fromCharCode(parseInt(byte, 2));
  }
  return message;
}

function downloadImage() {
  const canvas = document.getElementById("canvas");
  const link = document.createElement("a");
  link.download = "encoded_image.png";
  link.href = canvas.toDataURL();
  link.click();
}
