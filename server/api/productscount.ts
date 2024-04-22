let productcounter: number = 0;

export default async () => {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve(productcounter++);
        }, 2500);
    });
    return {
        productcounter
    };
};