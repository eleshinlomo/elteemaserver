const HOME_URL = process.env.HOME_URL

export const notAuthenticatedHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Authentication Failed</title>
    <style>
        /* Similar styling as above, with different colors */
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .error-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 30px;
            max-width: 500px;
            text-align: center;
        }
        h1 {
            color: #dc3545;
            margin-top: 0;
        }
        a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #6c757d;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        a:hover {
            background-color: #5a6268;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <h1>Authentication Failed</h1>
        <p>You are not authenticated. Either your code has been previously used or there is a problem with your credential</p>
        <p>Please check your verification code and try again.</p>
        <a href="${HOME_URL}/authpages/signin">Try Again</a>
    </div>
</body>
</html>
`;