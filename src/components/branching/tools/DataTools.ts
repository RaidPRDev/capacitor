import { BranchViewData } from "@/ui/navigation/branching/types";
import { loadJSONFile } from "@/utils/FileTools";
import { ShallowRef } from "vue";

// branch view components
import BranchDefault from '@/components/branching/branches/BranchDefault.vue';
import BranchList from '@/components/branching/branches/BranchList.vue';
import BranchChecklist from '@/components/branching/branches/BranchChecklist.vue';
import BranchInput from "../branches/BranchInput.vue";

export async function loadViewData(url: string, views: ShallowRef<BranchViewData[]>) {
  
  return new Promise<any>(async (resolve) => {

    const data = await loadJSONFile(`/assets/data/${url}`) as BranchViewData[];
    if (!Array.isArray(data)) resolve([]);

    views.value = data?.map((dataItem) => {
      const viewData = dataItem;
      switch (viewData.layout) {
        case "list":
          viewData.component = BranchList;
        break;
        
        case "checklist":
          viewData.component = BranchChecklist;
        break;
        
        case "input":
          viewData.component = BranchInput;
        break;
        
        default:
          viewData.component = BranchDefault;
        break;
      }
      return viewData;
    });

    resolve(views);
  })
  
  

  // setTimeout(() => { loading.value = false; }, 750);
}