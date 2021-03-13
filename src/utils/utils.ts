import moment from 'moment';
import { parse } from 'querystring';
import { Area } from 'umi';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);
 

export const diffTwoDate = (from: any, to: any) => {
  const fromMoment = moment(from);
  const toMoment = moment(to);
  const diffYear = fromMoment.diff(toMoment, "years");
  const diffMonth = fromMoment.diff(toMoment, 'months');
  const diffDay = fromMoment.diff(toMoment, 'days');
  const diffHour = fromMoment.diff(toMoment, "hours");
  const diffMinute = fromMoment.diff(toMoment, "minutes");
  const diffSecond = fromMoment.diff(toMoment, "seconds");
  console.log(diffYear, diffMonth, diffDay, diffHour, diffMinute, diffSecond);

  if (diffYear !== 0) {
    return diffYear === 1 ? `${diffYear} Year ago` : `${diffYear} Years ago`
  }
  if (diffMonth !== 0) {
    return diffMonth === 1 ? `${diffMonth} Month ago` : `${diffMonth} Months ago`
  }
  if (diffDay !== 0) {
    return diffDay === 1 ? `${diffDay} Day ago` : `${diffDay} Days ago`
  }  
  if (diffHour !== 0) {
    return diffHour === 1 ? `${diffHour} Hour ago` : `${diffHour} Hours ago`
  }  
  if (diffMinute !== 0) {
    return diffMinute === 1 ? `${diffMinute} Minute ago` : `${diffMinute} Minutes ago`
  }
  return diffSecond === 1 ? `${diffSecond} Second ago` : `${diffSecond} Seconds ago`
}


export const sortArea = (areas: Area[]) => {
  const newAreas = areas.sort((a: Area, b: Area) => {
    if (a.y < b.y) {
      return -1;
    }
    if (a.y === b.y && a.x < b.x) {
      return -1;
    }

    return 1;
  });

  return newAreas.map((item) => {
    return {
      key: item.id,
      ...item
    }
  });
};