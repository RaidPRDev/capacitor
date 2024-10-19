import { ref } from 'vue';
import { IBaseBreadcrumbProps, IBreadcrumbItem } from '../types';

interface IUseBranchingProps {
  branchingRef?: any;
  extraHeight?: number;
  overrideHeight?: number;
}

const useBranching = (props: IUseBranchingProps) => {

  const DEBUG = false;  
  const baseHeight = ref(0);
  const breadcrumbs = ref<IBaseBreadcrumbProps>({
    items: []
  });

  function changeView(data:IBreadcrumbItem) {
    if (DEBUG) console.log("UseBranching.changeView", data)
    props?.branchingRef.value?.goToBranchByID(data?.id);
  }
  
  function changeViewByID(id:string) {
    if (DEBUG) console.log("UseBranching.changeViewByID", id, props?.branchingRef.value)
    props?.branchingRef.value?.goToBranchByID(id);
  }

  function goBackToPreviousView() {
    if (DEBUG) console.log("UseBranching.goBackToPreviousView")
    props?.branchingRef.value?.navigateBack();
  }
  
  return {
    baseHeight,
    breadcrumbs,
    changeView,
    changeViewByID,
    goBackToPreviousView
  }
};

export default useBranching;