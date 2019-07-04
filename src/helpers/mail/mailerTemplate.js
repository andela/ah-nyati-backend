const mailTemplate = token => (
  `
  <div>
  <h1 style="color:blue;margin-left:30px;">Hey there</h1>
  <br />
  <br />
  <h2 style="color:red;margin-left:30px;">Here is signup verification code</h1>:
  <br />
  <br />
  ${token}
  <br />
  <br />
  <h3style="color:blue;margin-left:20px;">Thank You</h3>
  </div>
  `
);

export default mailTemplate;
