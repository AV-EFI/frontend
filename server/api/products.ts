import data from "./products.json";
export default defineEventHandler(async () => {
    return {
        data,
    };
});
