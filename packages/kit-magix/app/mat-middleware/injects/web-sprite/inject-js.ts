
export function getInjectJs (wsPort) {
  return `;(function(){

  const ws = new WebSocket('ws://127.0.0.1:${wsPort}')
  ws.addEventListener('open', e =>{
      console.log("[WEBUI] websocket 握手成功!");
  })

  ws.addEventListener('close', e => {
      console.log('[WEBUI] websocket 服务器关闭了!')
  })

  let cliHelp_el = document.createElement('div')
  let cliHelp_body = document.querySelector('body')
  let cliHelp_head = document.querySelector('head')
  let cliHelp_style = document.createElement('style')
  cliHelp_style.innerHTML = \`
      @font-face {
          font-family: 'magix-cli-webui-iconfont';  /* project id 1503732 */
          src: url('//at.alicdn.com/t/font_1503732_56xu4ohqmfc.eot');
          src: url('//at.alicdn.com/t/font_1503732_56xu4ohqmfc.eot?#iefix') format('embedded-opentype'),
          url('//at.alicdn.com/t/font_1503732_56xu4ohqmfc.woff2') format('woff2'),
          url('//at.alicdn.com/t/font_1503732_56xu4ohqmfc.woff') format('woff'),
          url('//at.alicdn.com/t/font_1503732_56xu4ohqmfc.ttf') format('truetype'),
          url('//at.alicdn.com/t/font_1503732_56xu4ohqmfc.svg#iconfont') format('svg');
      }

      .mwu-iconfont {
          font-display: fallback; 
          font-family: 'magix-cli-webui-iconfont';
          line-height: 1;
          font-size: 16px;
          font-style: normal;
          font-variant: normal;
          font-weight: normal;
          speak: none;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
      }

      .cli-help-wrap {
          font-size:12px;
          position:fixed; 
          right:30px; 
          top:40px; 
          color: #666;
          z-index: 100000000;
      }
      .cli-help-trigger {
          padding: 6px 10px;
          box-shadow: 3px 3px 5px rgba(0,0,0,0.1); 
          border-radius: 4px;
          border:1px solid #ccc; 
          background:white; 
          text-align:center; 
          line-height:1.5;
          cursor: pointer;
      }
      .cli-help-docs-list {
          position: absolute;
          right: 0;
          top: 40px;
          border-radius: 5px;
          background: white;
          border: 1px solid #ccc;
          white-space: nowrap;
          padding: 20px;
          line-height: 2;
          box-shadow: 3px 3px 5px rgba(0,0,0,0.1);
      }

      .cli-help-hide {
          display: none;
      }
     
  \`

  cliHelp_head.appendChild(cliHelp_style)
  cliHelp_el.classList.add('cli-help-wrap')

  cliHelp_el.innerHTML = \`
      <div class="cli-help-trigger" draggable="true">Magix开发帮助 <i style="margin-left:3px; color:#999;" id="cliHelpHide" class="mwu-iconfont" title="隐藏帮助">&#xe662;</i></div> 
      <div class="cli-help-docs-list cli-help-hide"> 
          <i class="mwu-iconfont" id="cliHelpClose" style="position: absolute; right: 15px; top: 15px; cursor:pointer; font-size: 20px; color: #999;">&#xe6fe;</i>
          <iframe id="cliHelpIframe" style="width:700px;border:0;vertical-align:middle;"></iframe>
      </div>
  \`
  
  let cliHelp_clear = cliHelp_el.querySelector('#cliHelpHide')
  let cliHelp_close = cliHelp_el.querySelector('#cliHelpClose')
  let cliHelp_trigger = cliHelp_el.querySelector('.cli-help-trigger')
  let cliHelp_popup = cliHelp_el.querySelector('.cli-help-docs-list')

  cliHelp_trigger.addEventListener('dragend', (e) => {
      cliHelp_el.style.right = 'auto'
      cliHelp_el.style.left = e.pageX - 30 + 'px'
      cliHelp_el.style.top = e.pageY - document.documentElement.scrollTop -30 +'px'
  })

  cliHelp_close.addEventListener('click', (e) => {
    const cliHelpIframe = document.getElementById('cliHelpIframe')
    cliHelp_popup.classList.add('cli-help-hide')
    cliHelpIframe && (cliHelpIframe.src = '')
  })

  cliHelp_trigger.addEventListener('click', (e) => {
    const cliHelpIframe = document.getElementById('cliHelpIframe')

    if (cliHelpIframe) {
        cliHelpIframe.style.height = (document.documentElement.clientHeight - 150) + 'px';

        //cliHelpIframe.src = 'https://cz.taobao.com:1234?wsPort=${wsPort}'
        //cliHelpIframe.src = 'https://internal-mo.m.taobao.com/magix-cli-webui?preview=1&wsPort=${wsPort}'
        cliHelpIframe.src = 'https://mo.m.taobao.com/magix-cli-webui?&wsPort=${wsPort}'
    }

    if (cliHelp_popup.classList.contains('cli-help-hide')) {
        cliHelp_popup.classList.remove('cli-help-hide')
    } else {
        cliHelp_popup.classList.add('cli-help-hide')
        cliHelpIframe.src = ''
    }
      
  })

  cliHelp_clear.addEventListener('click', (e)=> {
      cliHelp_el.remove()
  })

  cliHelp_body.appendChild(cliHelp_el)
}());`
}
