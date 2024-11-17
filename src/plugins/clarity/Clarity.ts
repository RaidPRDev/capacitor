/**
 * Microsoft Clarity Plugin for Vue3
 * 
 * https://clarity.microsoft.com/
 * https://learn.microsoft.com/en-us/clarity/
 * 
 * .use(clarity, { ID: "k5w2b9nttb", enabled: true })
 * 
 */
import { App } from 'vue'
// import { getCookie } from '@/baseui/utils/Tools';

declare global {
    interface Window { 
        clarity: any; 
    }
}
interface IClarityPluginOptions {
  enabled: boolean;
  ID: string;
}

let optionsDefaults:IClarityPluginOptions = {
  enabled: true,
  ID: ""
}

export default 
{
  /** @ts-ignore */
  install: (app:App, opts:IClarityPluginOptions | null = null) => 
  {
    // merge options
    const options = { ...optionsDefaults, ...opts }

    // providing via symbol 'device', access via injection
    const stats = new ClarityScript(options);
    if (options.enabled) stats.initialize();
  }
};

interface IClarityScript
{
  initialize():void;  
}

class ClarityScript implements IClarityScript
{
  options: IClarityPluginOptions;
  
  constructor(options: IClarityPluginOptions)
  {
    this.options = options;
  }

  initialize():void
  {
    // const cookieConsentObj = getCookie('consent');
    // const cookieConsentData = cookieConsentObj ? JSON.parse(cookieConsentObj!) : null;
    // console.log("[clarity.cookie.consent]", cookieConsentData);

    // if (!cookieConsentData) return;
    // if (cookieConsentData.analytics !== 1) return;

    console.log("[clarity].init");

    if (this.options.ID.length === 0)
    {
      console.warn("Clarity ID not set.");
      return;
    }

    const script = document.createElement("script");
    script.id = "clarity-init-js";
    script.async = true;
    script.textContent = `
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${this.options.ID}");
    `;

    const head = document.head || document.getElementsByTagName("head")[0];
    head.appendChild(script);
    console.log("[clarity.loaded]");
  }
}