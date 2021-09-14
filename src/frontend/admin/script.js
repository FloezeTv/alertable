const LIST_ITEM_CLASS = 'list-item';
const LIST_ITEM_VIDEO_PARENT_CLASS = 'video-parent';
const LIST_ITEM_VIDEO_CLASS = '';
const LIST_ITEM_INFO_CLASS = 'info';
const LIST_ITEM_TITLE_CLASS = 'title';
const LIST_ITEM_ORIGINAL_NAME_CLASS = 'originalname';
const LIST_ITEM_TAGS_CLASS = 'tags';
const LIST_ITEM_NAME_LIST_CLASS = 'name-list';
const LIST_ITEM_NAME_LIST_ITEM_CLASS = 'name-listitem';

const uploadFormFrame = document.getElementById('uploadFormFrame');
const list = document.getElementById('list');

const createElement = (parent, content, className, tag = 'div', elementCallback = (el) => undefined) => {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    element.innerHTML = content;
    elementCallback(parent.appendChild(element));
    return element;
}

const updateEvents = () => {
    // TODO: this
}

const loadVideos = () => {
    fetch('/api/alerts/list/all').then(r => r.json()).then(Object.entries).then(alerts => alerts.forEach(([id, info]) => createListElement(id, info)));
}

uploadFormFrame.onload = () => {
    if (!uploadFormFrame.contentDocument.body.innerHTML) return;
    const result = JSON.parse(uploadFormFrame.contentDocument.body.firstChild.innerHTML);

    if (!result.success) {
        alert('Something went wrong!');
        return;
    }

    createListElement(result.id, result.info);
}

const createListElement = (id, info) => {
    const listItem = createElement(list, '', LIST_ITEM_CLASS);

    createElement(createElement(listItem, '', LIST_ITEM_VIDEO_PARENT_CLASS), '', LIST_ITEM_VIDEO_CLASS, 'video', video => {
        video.loop = true;
        video.muted = true;
        video.autoplay = true;
        video.controls = false;
        video.src = '/api/alerts/videos/proxy/' + id;
    });

    const itemInfo = createElement(listItem, '', LIST_ITEM_INFO_CLASS);
    createElement(itemInfo, info.name, LIST_ITEM_TITLE_CLASS);
    createElement(itemInfo, info.originalname, LIST_ITEM_ORIGINAL_NAME_CLASS);
    createElement(itemInfo, info.tags.join(', '), LIST_ITEM_TAGS_CLASS);

    const nameList = createElement(itemInfo, '', LIST_ITEM_NAME_LIST_CLASS);
    const createNameListItem = (value = '') => createElement(nameList, '', LIST_ITEM_NAME_LIST_ITEM_CLASS, 'input', input => {
        input.type = 'text';
        input.value = value;
        input.oninput = () => {
            if (input.value && input.parentElement.lastChild === input)
                createNameListItem();
        }
        input.onblur = () => {
            updateEvents();
            if (input.value) return;
            if (input.parentElement.lastChild === input) return;
            input.parentElement.removeChild(input);
        }
    });
    if (info.events)
        info.events.forEach(createNameListItem);
    createNameListItem();
}

loadVideos();