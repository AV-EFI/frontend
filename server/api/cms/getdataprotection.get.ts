export default defineEventHandler(async (event) => {
    try {
        const response = await fetch('https://datenschutz.gwdg.de/services/av-efi');
        const htmlContent = await response.text();
        return htmlContent;
    }
    catch(ex) {
        console.log(ex);
        return null;
    }
});