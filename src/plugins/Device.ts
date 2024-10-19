/**
 * Device Plugin for Vue3
 * 
*/

// import KeyboardFocus from '@/baseui/utils/KeyboardFocus';
import { App, inject, reactive, shallowRef } from 'vue'

const IS_CLIENT = typeof window !== 'undefined';

export interface IDevicePluginOptions {
  enabled: boolean  
}

let optionsDefaults:IDevicePluginOptions = {
  enabled: true
}

export default 
{
  install: (app:App, opts:IDevicePluginOptions | null = null) => 
  {
    // merge options
    const options = { ...optionsDefaults, ...opts }

    // providing via symbol 'device', access via injection
    app.provide<IDevice>('device', new Device(options));
  }
};

type DeviceOS = "mac" | "windows" | "ios" | "android" | "unknown";
type DeviceType = "tablet" | "phone" | "desktop" | "unknown";
type DeviceOrientation = "landscape" | "portrait" | "init";
type DeviceBrowser = "edge" | "chrome" | "safari" | "firefox" | "ie11" | "unknown";

interface IDeviceResolution {
  width: number;
  height: number;
}

interface IDeviceState {
  type: DeviceType; 
  os: DeviceOS;
  browser: DeviceBrowser; 
  resolution: IDeviceResolution; 
  viewport: IDeviceResolution;
  orientation: DeviceOrientation; 
  ios: boolean; 
  android: boolean;
  windows: boolean;
  macos: boolean;
  touch: boolean; 
  pointer: boolean;
  webp: boolean;
  keyboard: boolean;
  navigator: Navigator | any;
}

interface IAgent {
  ua: string;
  platform: string
}

export interface IDevice {
  state: IDeviceState;
  webp: boolean;
  orientationChanged: boolean;
  softKeyboardOpen: boolean;
  afterUpdate: Function | null;
  timeout:number;
  init(): void;
  update(): void;
  deferUpdate(): void;
  agent(): IAgent;
  get(): IDeviceState;
  isMobile():boolean;
  getOffsetWidth():number;
  getNavigator():any;
}

class Device implements IDevice
{
  app: HTMLElement;
  state: IDeviceState;
  webp: boolean;
  orientationChanged: boolean;
  softKeyboardOpen: boolean;
  afterUpdate: Function | null;
  timeout:number;
  options:IDevicePluginOptions;

  constructor(options:IDevicePluginOptions)
  {
    this.options = options;

    this.state = reactive<IDeviceState>({
      type: "unknown",
      os: "unknown",
      browser: "unknown",
      resolution: { width: 0, height: 0 },
      viewport: { width: 0, height: 0 },
      orientation: "init", 
      ios: false,
      android: false,
      windows: false,
      macos: false,
      touch: false, 
      pointer: false,
      webp: false,
      keyboard: false,
      navigator: shallowRef<any>(null)
    });

    this.app = document.getElementById("app") as HTMLElement;
    this.webp = false;
    this.orientationChanged = false;
    this.softKeyboardOpen = false;
    this.afterUpdate = null;
    this.timeout = 0;    
  }

  init() 
  {
    // detect webp support
    this.webp = this.canUseWebP();

    this.deferUpdate = this.deferUpdate.bind(this);
    this.update = this.update.bind(this);

    if (!this.options?.enabled) return;

    window.addEventListener('resize', this.deferUpdate);

    this.update();
  }

  deferUpdate()
  {
    // console.log("**** RESIZE DEFER UPDATE")

    window.clearTimeout(this.timeout);

    // no need to defer on desktop
    if (this.state.type === "desktop")
    {
      this.update();
      return;
    }

    this.timeout = window.setTimeout(() => {
      this.update();
    }, 1000)
    
  }

  update()
  {
    // console.log("**** RESIZE UPDATE")

    // init user agent and platform
    if (!IS_CLIENT) return;

    const html = document.querySelector("html");
    if (!html) return;

    // remove classes
    if (this.state.touch) html.classList.remove("touch"); else html.classList.remove("no-touch");
    html.classList.remove(this.state.type);
    html.classList.remove(this.state.orientation);
    if (this.state.webp) html.classList.remove('webp'); else html.classList.remove('no-webp');
    if (!this.state.ios && !this.state.android)
    {
      if (this.state.macos) html.classList.remove("macos");
      if (this.state.windows) html.classList.remove("windows");
    }
    else 
    {
      if (this.state.ios) html.classList.remove("ios");
      if (this.state.android) html.classList.remove("android");
    }

    // ensure we reset scroll position on orientation change
    if (this.state.orientation === "landscape")
    {
      //let top = window.pageYOffset || document.documentElement.scrollTop;
      //if (top > 0) window.scrollTo(0, 0);
    }

    let type: DeviceType = "unknown"; 
    let os: DeviceOS = "unknown";
    let browser: DeviceBrowser = "unknown"; 
    let resolution: IDeviceResolution = { width: 0, height: 0 }; 
    let viewport: IDeviceResolution = { width: 0, height: 0 }; 
    let orientation: DeviceOrientation = "landscape"; 
    let ios: boolean = false; 
    let android: boolean = false;
    let windows: boolean = false;
    let macos: boolean = false;
    let touch: boolean = false; 
    let pointer: boolean = false;
    let webp: boolean = this.webp;

    // init detection
    const navigator = window.navigator;
    const ua = (navigator) ? navigator.userAgent : false;
    if (!ua) { console.warn("[uar_device] no user agent found"); return; }
    const platform = navigator.platform; // OR Navigator.userAgentData || Navigator.userAgentData.platform

    this.state.navigator = shallowRef<Navigator>(navigator);

    // mobile devices ie: tablet/phone 
    android = !!ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    
    let ipad = ua.match(/iPad/g) ? true : false;
    let ipod = ua.match(/iPod/g) ? true : false;
    let iphone = !ipad && ua.match(/iPhone/g) ? true : false;

    // desktop platforms
    windows = platform === 'Win32';
    macos = platform === 'MacIntel';

    // check if we are on iPad Tablet
    pointer = !!window.PointerEvent && 'maxTouchPoints' in window.navigator && navigator.maxTouchPoints === 0;
    
    // @ts-ignore next-line
    touch = !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch);
    if (!touch) touch = navigator.maxTouchPoints > 0;

    // check if we are on chrome dev tools
    if (ua.match(/Macintosh/g) && platform === 'Win32' && ua.match(/Intel Mac/g))
    {
      macos = true;
      windows = false;
    }

    // ensure the device is not a tablet
    if (!ipad && macos && touch)
    {
      ipad = true;
      macos = false;
      windows = false;
    }

    // check android
    if (android) 
    {
      os = 'android';
      android = true;
      type = (ua.match(/Tablet/i)) ? "tablet" : "phone";
    }

    // ios family
    if (ipad || iphone || ipod) 
    {
      os = 'ios';
      ios = true;
      type = (ipad) ? "tablet" : "phone";
    } 

    // check os, but ensure we are not on a mobile device
    if (!ios && !android)
    {
      if (windows || macos) 
      {
        os = (windows) ? 'windows' : 'mac';
        type = "desktop";
      }
    }

    // update screen
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    /*if (android && KeyboardFocus.isFocused)
    {
      screenWidth = screen.width;
      screenHeight = screen.height;
    }*/

    // update visual viewport, fallback to inner res if not available
    let viewportWidth = window.visualViewport !== void 0 ? window.visualViewport?.width : window.innerWidth;
    let viewportHeight = window.visualViewport !== void 0 ? window.visualViewport?.height : window.innerHeight;
    
    resolution = { width: screenWidth, height: screenHeight }
    viewport = { width: viewportWidth as number, height: viewportHeight as number }
    orientation = (screenWidth > screenHeight) ? "landscape" : "portrait";

    if (this.state.orientation !== orientation)
    {
      this.orientationChanged = true;
    }

    // browsers
    // @ts-ignore next-line
    let ie11 = !!window.MSInputMethodContext && !!document.documentMode;
    let edge = !!ua.match(/Edg/g) && ua.toLowerCase().indexOf('chrome') >= 0;
    let chrome = ua.toLowerCase().indexOf('chrome') >= 0 && !edge;
    let safari = ua.toLowerCase().indexOf('safari') >= 0 && ua.toLowerCase().indexOf('chrome') < 0 && ua.toLowerCase().indexOf('android') < 0;
    let firefox = !!ua.match(/FxiOS/g);

    if (ie11) browser = "ie11";
    if (edge) browser = "edge";
    if (chrome) browser = "chrome";
    if (safari) browser = "safari";
    if (firefox) browser = "firefox";

    // add classes
    if (touch) html.classList.add("touch"); else html.classList.add("no-touch");
    html.classList.add(type);
    html.classList.add(orientation);
    if (webp) html.classList.add('webp'); else html.classList.add('no-webp');
    if (!ios && !android)
    {
      if (macos) html.classList.add("macos");
      if (windows) html.classList.add("windows");
    }
    else 
    {
      if (ios) html.classList.add("ios");
      if (android) html.classList.add("android");
    }

    // set state
    this.state.type = type;
    this.state.os = os;
    this.state.browser = browser;
    this.state.resolution = resolution;
    this.state.viewport = viewport;
    this.state.orientation = orientation;
    this.state.ios = ios;
    this.state.android = android;
    this.state.windows = windows;
    this.state.macos = macos;
    this.state.touch = touch;
    this.state.pointer = pointer;

    window.requestAnimationFrame(() => 
    {
      /*
      // Need only for certain scenarios when app has fixed height...
      if (document.activeElement && document.activeElement.tagName === "BODY")
      {
        window.scrollTo(0, 0);
      }*/
        
      if (document.activeElement && document.activeElement.tagName === "INPUT")
      {
        this.afterUpdate && this.afterUpdate();
      }
    })
  }

  getNavigator() {
    // const navigator = window.navigator;
    // const ua = (navigator) ? navigator.userAgent : false;
    // if (!ua) { console.warn("[uar_device] no user agent found"); return; }
    // const platform = navigator.platform; // OR Navigator.userAgentData || Navigator.userAgentData.platform

    return window.navigator;
  }


  get():IDeviceState
  {
    return this.state
  }

  canUseWebP() 
  {
    const elem = document.createElement('canvas');

    if (!!(elem.getContext && elem.getContext('2d'))) 
    {
      // was able or not to get WebP representation
      return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
    }

    // very old browser like IE 8, canvas not supported
    return false;
  }

  agent():IAgent 
  {
    const navigator = window.navigator;
    const ua = (navigator) ? navigator.userAgent : "";
    
    // DEPRECATED: Navigator.userAgentData? || Navigator.userAgentData.platform?
    const platform = navigator.platform; 

    return {
      ua,
      platform,
    }
  }

  isMobile():boolean
  {
    return this.state.type === "tablet" || this.state.type === "phone"
  }

  getOffsetWidth = () =>
  {
    const offsetW = this.app.offsetLeft as number;
    return this.state.resolution.width - (offsetW * 2)
  }
}

// recommended way to use, but only can be used in composition setup
export const useDevice = () =>
{
  const device = inject<IDevice>('device');
  return device;  
}