const rootElement = document.documentElement;
const colorPicker = document.querySelector('input[type=color]');
const fontSizer = document.querySelector('input[type=number]');
const backgroundController = document.getElementById('backgroundController');
const tabs = document.getElementsByClassName('tab-list__tab');
const tabPanels = document.getElementsByClassName('tab-panel-container__tab-panel');
const activeTabClass = 'tab-list__tab--active';
const activeTabPanelClass = 'tab-panel-container__tab-panel--active';

initBackgroundController();

initColorPicker();

initFontSizer();

initTabController();

function initTabController() {
    tabs[0].classList.add(activeTabClass);
    tabPanels[0].classList.add(activeTabPanelClass);

    Array.from(tabs).forEach((tab) => tab.onclick = handleTabSelection);
}

let activeTabName;
function handleTabSelection(e) {
    const selectedTabName = e.currentTarget.getAttribute('name');
    console.info('tab selected: ', selectedTabName);

    if (activeTabName === selectedTabName) {
        return;
    }
    const pervActiveTabPanel = [...tabPanels].find((tabPanel) => tabPanel.classList.contains(activeTabPanelClass));
    const nextActiveTabPanel = [...tabPanels].find((tabPanel) => tabPanel.getAttribute('name') === selectedTabName);
    const pervActiveTab = [...tabs].find((tab) => tab.classList.contains(activeTabClass));
    pervActiveTab.classList.remove(activeTabClass);
    pervActiveTabPanel.classList.remove(activeTabPanelClass);
    nextActiveTabPanel.classList.add(activeTabPanelClass);
    e.currentTarget.classList.add(activeTabClass);

    activeTabName = selectedTabName;
}

function getCustomStylePropertiesByRegExp(regExp) {
    const style = getComputedStyle(rootElement);

    return Object.keys(style)
        .filter((key) => regExp.test(style[key]))
        .reduce((customProperties, key) => {
            const property = style[key];
            customProperties[property] = style.getPropertyValue(property);

            return customProperties;
        }, {});
}

function initColorPicker() {
    colorPicker.onchange = (e) => {
        console.log('set background (picked color): ', e.currentTarget.value);

        rootElement.style.setProperty('--page-background', e.currentTarget.value);
    };
}

function initFontSizer() {
    fontSizer.onchange = (e) => {
        console.log('set font-size: ', e.currentTarget.value);

        rootElement.style.setProperty('--base-unit', e.currentTarget.value + 'px');
    }
}

function initBackgroundController() {
    const customBackgrounds = getCustomStylePropertiesByRegExp(/--bg-/);
    const currentBackground = rootElement.style.getPropertyValue('--page-background');

    const defaultOption = createOption({
        value: colorPicker.value,
        label: '-default-',
    });

    backgroundController.appendChild(defaultOption);

    Object.keys(customBackgrounds).forEach(backgroundKey => {
        const option = createOption({
            value: customBackgrounds[backgroundKey],
            label: backgroundKey.replace('--bg-grad-', ''),
        });

        backgroundController.appendChild(option);
    });


    backgroundController.onchange = (e) => {
        console.log('set background (variable): ', e.currentTarget.value);

        rootElement.style.setProperty('--page-background', e.currentTarget.value);
    };

    backgroundController.value = currentBackground;    
}

function createOption(props) {
    const option = document.createElement('option');
    option.value = props.value;
    option.text = props.label;

    return option;
}
