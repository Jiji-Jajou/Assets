const assetsList = document.getElementById('assets-list');

const assetCount = document.getElementById('asset-count');
const activeCount = document.getElementById('active-count');

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

const renderList = (container, items, renderer) => {
    container.innerHTML = '';
    if (!items.length) {
        const empty = document.createElement('div');
        empty.className = 'list-item';
        empty.textContent = 'Aucune donnée';
        container.appendChild(empty);
        return;
    }
    items.forEach((item) => container.appendChild(renderer(item)));
};

const loadAssets = async () => {
    const [assetsData, assignmentsData, employeesData] = await Promise.all([
        api('/api/assets'),
        api('/api/assignments'),
        api('/api/employees'),
    ]);
    assetCount.textContent = assetsData.assets.length;

    const activeAssignments = assignmentsData.assignments.filter(
        (assignment) => assignment.status === 'active'
    );
    activeCount.textContent = activeAssignments.length;

    const activeByAssetId = new Map();
    activeAssignments.forEach((assignment) => {
        if (assignment.asset && assignment.asset._id) {
            activeByAssetId.set(assignment.asset._id, assignment);
        }
    });

    renderList(assetsList, assetsData.assets, (asset) => {
        const row = document.createElement('div');
        row.className = 'list-item';
        const assignment = activeByAssetId.get(asset._id);
        const employeeName = assignment?.employee?.name || 'Non attribué';
        const assignmentLabel = assignment
            ? `Attribué à ${employeeName}`
            : 'Disponible';

        const typeLabels = {
            laptop: 'Ordinateur portable',
            desktop: 'Ordinateur fixe',
            phone: 'Téléphone',
            tablet: 'Tablette',
            monitor: 'Écran',
            other: 'Autre',
        };
        const typeLabel = typeLabels[asset.type] || asset.type || '';

        row.innerHTML = `
            <div>
                <strong>${asset.name}</strong>
                <span>${typeLabel} - ${asset.serialNumber}</span>
            </div>
            <span class="badge">${assignmentLabel}</span>
        `;

        if (!assignment) {
            const actions = document.createElement('div');
            actions.className = 'actions';
            const select = document.createElement('select');
            select.innerHTML = '<option value="">Choisir un employé</option>';
            employeesData.employees.forEach((employee) => {
                const option = document.createElement('option');
                option.value = employee._id;
                option.textContent = employee.name;
                select.appendChild(option);
            });
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = 'Attribuer';
            button.addEventListener('click', async () => {
                if (!select.value) {
                    alert("Sélectionne d'abord un employé.");
                    return;
                }
                try {
                    await api('/api/assignments', {
                        method: 'POST',
                        body: JSON.stringify({
                            assetId: asset._id,
                            employeeId: select.value,
                        }),
                    });
                    await refreshAll();
                } catch (error) {
                    alert(error.message);
                }
            });
            actions.appendChild(select);
            actions.appendChild(button);
            row.appendChild(actions);
        } else {
            const actions = document.createElement('div');
            actions.className = 'actions';
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = 'Désattribuer';
            button.addEventListener('click', async () => {
                try {
                    await api(`/api/assignments/${assignment._id}/return`, {
                        method: 'POST',
                    });
                    await refreshAll();
                } catch (error) {
                    alert(error.message);
                }
            });
            actions.appendChild(button);
            row.appendChild(actions);
        }
        return row;
    });
};

const refreshAll = async () => {
    await loadAssets();
};

refreshAll().catch((error) => {
    alert(error.message);
});
