import 'whatwg-fetch';
import React, {Component} from 'react';
import { joinParams } from './url';
import Toast from '../component/toast/toast';

export function Fetch(url, options) {
  return fetch(url, Object.assign({}, {credentials: 'same-origin'}, options))
    .then(resp => {
      return resp.json();
    })
    .then(json => {
      if (!json.success) {
        Toast.show(json.message || '系统错误')
      }else{
        if(json.data === void 0 || json.data === null){
          json.data = json.data || {};
        } 
        return json.data;
      }
    })
    .catch(function(e) {
      Toast.show(e.message);
    });
}

export function get(url, data, options={}){
  let paramsStr = joinParams(data);
  paramsStr =  paramsStr ? `?${paramsStr}` : '';
  return Fetch(`${url}${paramsStr}`, options);
}

export function post(url, data, options={}){
  // const formData = new FormData();
  // for(let i in data){
  //   if(typeof data[i] === 'object'){
  //     formData.append(i, JSON.stringify(data[i]))
  //   }else{
  //     formData.append(i, data[i])
  //   }
  // }
  // return Fetch(url, {
  //   method: 'POST',
  //   body: formData
  // })
  const formData  = {};
  for(let i in data){
    if(data[i] !== void 0){
      formData[i] = data[i];
    }
  }
  return Fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    // body: formData
    body: JSON.stringify(formData)
  })
}


export default Fetch