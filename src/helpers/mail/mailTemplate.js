const mailTemplate = (name, message) => {
  const template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      body {
        box-sizing: border-box;
      }
      .header {
        background-color: #2E99D6;
        height: 45px;
      }
      .header-logo {
        width: 100%;
        text-align: center;
        color: #ffffff;
        font-size: 30px;
      }
      .body {
        padding: 5px 10px;
        font-size: 16px;
        margin-bottom: auto;
      }
      .message {
        padding: 10px 0;
      }
      .footer {
        width: 100%;
        text-align: center;
        color: #ffffff;
        background-color: #2E99D6;
        height: 35px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="header-logo">
        Author Haven
      </div>
    </div>
    <div class="body">
      <p class="greeting">Hey ${name},</p>
      <p class="message">${message}</p>
    </div>
    <div class="footer">
      Sent from Author Haven
    </div>
  </body>
  </html>
  `;

  return template;
};

export default mailTemplate;
