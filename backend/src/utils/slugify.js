function slugify(text) {
    text = text
        .toString()
        .toLowerCase()
        .trim()
        .normalize('NFD') 
        .replace(/[\u0300-\u036f]/g, ''); 
    text = text
        .replace(/\s+/g, '-') 
        .replace(/[^\w-]+/g, '') 
        .replace(/--+/g, '-'); 

    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${text}-${randomSuffix}`;
}

module.exports = slugify;