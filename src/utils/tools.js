// 存放一些常用的方法

// export const $confirm = (that)=>{
//     that.$confirm(
//         "此操作将永久删除该参数, 是否继续?",
//         "提示",
//         {
//           confirmButtonText: "确定",
//           cancelButtonText: "取消",
//           type: "warning"
//         }
//       ).catch(err => err);
// }
 
export const $confirm = (that) => {
    return new Promise((resolve, reject) => {
       const res= that.$confirm(
            "此操作将永久删除该参数, 是否继续?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          ).catch(err => {
              reject(err)
          });
          resolve(res)
    })
}



