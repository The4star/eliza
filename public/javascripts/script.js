const createList = document.querySelector('.create-list')
const createForm = document.querySelector('.list-name-creator')

const formAppear = (e) => {
    e.preventDefault();
    createForm.classList = 'list-name-creator-active';
};

const makeNewList = (e) => {
    e.preventDefault()
    const nameText = (document.querySelector('[id=name-of-list]').value);
    console.log(nameText)
    const theUrl = `/dashboard/${nameText}`
    document.location.href = theUrl
};

createList.addEventListener('click', formAppear)
createForm.addEventListener('submit', makeNewList)