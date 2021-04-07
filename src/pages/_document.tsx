import Document, { Html, Head, Main, NextScript } from 'next/document';

/**
 * Creates component that will be loaded for all the pages, according to the Next.js recommendations.
 */
export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    {/* Icon on the browser. */}
                    <link rel="shortcut icon" href="favicon.Shake.IT.png" type="image/png"/>

                    {/* Google Fonts */}
                    {/* Inter 400, 500, 600, normal. */}
                    {/* Rajdhani 600, normal. */}
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Rajdhani:wght@600&display=swap" rel="stylesheet" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}