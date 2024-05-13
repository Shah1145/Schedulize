export function getEmailTemplate(userFirstName, message) {
	return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>HTML + CSS</title>
        <style>
      body {
        background-color: #6875f5;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        height: 100vh;
        width: 100vw;
        box-sizing: border-box;
      }
      .container {
        background-color: #faf8ed;
        border-radius: 20px;
        padding: 70px 60px;
        display: flex;
        flex-direction: column;
      }
    </style>
      </head>
      <body>
        <div class="container">
          <div style="display: flex; justify-content: center; padding-bottom: 10px">
            <h1
              style="
                font-size: 60px;
                color: #6875f5;
                font-family: 'Bebas Neue', sans-serif;
                font-weight: extrabold;
              "
            >
              SCHEDULIZER
            </h1>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              padding: 24px;
            "
          >
            <h1
              style="
                color: #6875f5;
                font-size: 25px;
                font-family: 'Mukta Vaani', sans-serif;
                font-weight: 400;
              "
            >
              Hello ${userFirstName}
            </h1>
            <p
              style="
                font-size: 15px;
                font-family: 'Mukta Vaani', sans-serif;
                font-weight: 200;
              "
            >
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus
              molestiae distinctio reprehenderit, totam alias temporibus
              consectetur, soluta repellat neque vero debitis, qui id dolores?
              Recusandae nostrum illo impedit iusto quam? Lorem, ipsum dolor sit
              amet consectetur adipisicing elit. Repudiandae iure voluptatum
              eligendi quia, ratione in a porro mollitia. Blanditiis eligendi
              molestias laborum provident molestiae itaque dignissimos placeat cum
              ipsam cumque? <br />
              <br />
              ${message}
            </p>
          </div>
        </div>
      </body>
    </html> 
    `;
}
