import { computed, ref } from 'vue';
import { IApp } from '@/types';
import { IDevice } from '@/plugins/Device';

const DEBUG = false;

interface IUseAppStyleProps {
  device: IDevice | undefined;
  app: IApp;
}

const useAppStyles = (props: IUseAppStyleProps) => {

  const hasRendered = ref<boolean>(false);
  
  /**
   * This function prepares and returns custom styles for the 'app-wrapper' div element. 
   * It leverages Vue's computed properties to automatically trigger updates to the 
   * styles of the 'app-wrapper' whenever the relevant reactive data changes. 
   * 
   * Required Props:
   * - IApp: Contains the necessary application data and settings used to define styles.
   * - IDevice: Holds information about the current device (e.g., type, orientation, screen size) 
   *   that is used to adjust the styles accordingly.
   * 
   * Usage:
   * The function is used in Vue.js components where dynamic styling of the 'app-wrapper' 
   * is required. Computed ensures that whenever the dependent properties change, 
   * the styles are recomputed and applied.
   * 
   * Example:
   * const { styles: appStyles } = useAppStyles({ app, device });
   * 
   * <div :style="appStyles"></div>
   * 
   * Returns:
   * Object - A set of styles that will be applied to the 'app-wrapper' div.
   */
  const styles = computed(() => {
    
    if (DEBUG) console.log("AppStyles()");
    if (DEBUG) console.log("  device.state:", props?.device?.state);
    if (DEBUG) console.log("  device.mobile:", props?.device?.isMobile());
    
    if (!props.device?.isMobile()) {
      props.app.device.width = 375;
      props.app.device.height = 667;// 812;
      props.app.device.margin = 20;
      props.app.device.mobile = props.device?.isMobile()!;
    
      if (DEBUG) console.log("  desktop.width:", props.app.device.width);
      if (DEBUG) console.log("  desktop.height:", props.app.device.height);

      // non mobile devices
      return { 
        backgroundColor: `#f5f5f5`,
        width: `375px`, 
        height: `667px`,
        // height: `812px`,
        borderRadius: `47px`,
        overflow: `hidden`,
        marginTop: `-1px`
      }
    }

    const res = props.device?.state.resolution;

    // prevent resizing when running on device.
    if (hasRendered.value) {
      return { width: `${res.width}px`, height: `${props.app.device.height}px` }
    }

    props.app.device.width = res.width;
    props.app.device.height = res.height;
    props.app.device.margin = 20;
    props.app.device.mobile = props.device?.isMobile()!;
    props.app.device.isIOS = props.device?.state.ios;
    props.app.device.isAndroid = props.device?.state.android;

    if (DEBUG) console.log("  desktop.width:", props.app.device.width);
    if (DEBUG) console.log("  desktop.height:", props.app.device.height);

    hasRendered.value = true;

    return { width: `${res.width}px`, height: `${res.height}px` }
  });
  
  return {
    styles
  }
};

export default useAppStyles;