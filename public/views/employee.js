const employeeForm = document.getElementById('employee-form');

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

employeeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(employeeForm);
    const payload = Object.fromEntries(formData.entries());
    try {
        await api('/api/employees', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        employeeForm.reset();
        window.location.href = '/';
    } catch (error) {
        alert(error.message);
    }
});
