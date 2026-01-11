const assetForm = document.getElementById('asset-form');

const api = async (path, options = {}) => {
    const config = {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    };
    const response = await fetch(path, config);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.message || 'Échec de la requête');
    }
    return data;
};

assetForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(assetForm);
    const payload = Object.fromEntries(formData.entries());
    try {
        await api('/api/assets', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        assetForm.reset();
        window.location.href = '/';
    } catch (error) {
        alert(error.message);
    }
});
