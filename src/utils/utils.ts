import {driver} from "driver.js";
import Swal from "sweetalert2";

export function getRussianDate(): string {
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    const daysOfWeek = [
        'воскресенье', 'понедельник', 'вторник', 'среда',
        'четверг', 'пятница', 'суббота'
    ];

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const dayOfWeek = date.getDay();

    const russianDate = `${day} ${months[month]} ${year}, ${daysOfWeek[dayOfWeek]}`;
    return russianDate;
}


export function formatDate(timestamp: number) {
    const date = new Date(timestamp);


    const formattedDate = date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        weekday: 'long',
        day: 'numeric',
    });

    return formattedDate;
}

export function replaceTagsOfType(inputString: string, tagType: string, replacementText: string) {
    const regex = new RegExp(`<${tagType}[^>]*>.*?<\\/${tagType}>`, 'gi');
    return inputString.replace(regex, replacementText);
}


export function removeTagsExceptLinks(inputString: string) {
    return inputString.replace(/<(?!\/?a(?=>|\s.*>))\/?.*?>/g, '');
}

export function replaceTags(inputString: string, replacementText: string) {
    return inputString.replace(/<[^>]+>/g, replacementText);
}

export function validateImageUrl(input: string): boolean {
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    return urlRegex.test(input);
}


export const MatchLinkinText = (regex: RegExp, text: string) => {
    const matchedValue = text.match(regex);

    return {
        matchedValue,
    };
};

export const RemoveLinkfromText = (regex: RegExp, text: string) => {
    const Linkregex = /<a[^>]*>([^<]+)<\/a>/g;
    const replacedText = text.replace(regex, "$1");
    return {
        Linkregex,
        replacedText,
    };
};


export function isElementFullscreen(element: HTMLElement | Element | null) {

    return (
        // @ts-ignore
        document.fullscreenElement === element || document?.webkitFullscreenElement === element
    );
}

export function requestFullFramescreen(element: HTMLElement | Element | null) {
    if (element?.requestFullscreen) {
        element?.requestFullscreen();
    } else { // @ts-ignore
        if (element?.webkitRequestFullscreen) {
            // @ts-ignore
            element?.webkitRequestFullscreen();
            // @ts-ignore
        } else if (element?.mozRequestFullScreen) {
            // @ts-ignore
            element?.mozRequestFullScreen();
            // @ts-ignore
        } else if (element?.msRequestFullscreen) {
            // @ts-ignore
            element?.msRequestFullscreen();
        }
    }
}

export const cancelTour = () => {

    // @ts-ignore
    Swal.fire({
        title: 'Прервать экспресс гайд по приложению?',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonColor: '#1677FF',
        confirmButtonColor: '#1677FF',
        cancelButtonText: 'Отмена',
        confirmButtonText: 'Да',


    }).then(result => {
        if(result.isConfirmed){
            return true
        }

    })
    .catch((e) => {
        console.log(e)
        return false
    })

    return true

}