    <template>
      <el-upload
      :on-success="handleUploadSuccess"
      :on-remove="handleUploadRemove"
      action="/api/files"
      :on-preview="onPreview"
      :before-upload="handleUploadBefore"
      :file-list="uploadList"
      multiple
      ref="upload"
      class="app-upload"
    >           <!-- <i class="el-icon-upload"></i> -->
        <el-button size="small" type="primary">点击上传</el-button>
        <div class="el-upload__tip" slot="tip"><slot></slot></div>
    </el-upload>
    </template>

    <script>
    export default {
      name: 'upload',
      props: {
        'value': {
            type: Array,
            default () {
                return [];
            },
        },
        'fileList': {
            type: Array,
            default () {
              return [];
            }
        },
        'uploadText': String,
      },
      data () {
        return {
          uploadList: [],
        };
      },
      methods: {
        getFileList () {
          return this.$refs.upload.uploadFiles;
        },
        clearFiles () {
          this.$refs.upload.clearFiles();
        },
        handleUploadBefore (f) {
          // console.log(f);
          if (f.size > 200*1024*1024) {
            this.$message({type: 'warning',message:'上传文件大小不能超过200M！'});
            return false;
          }else {
            return true;
          }
        },
        handleUploadSuccess (p, f, fl) {
          // console.log(fl);
          if(p.status) {
            const id = p.data.file.id;
            const copy = [...this.value];
            
            f.id = id;
            f.downloadUrl = p.data.file.downloadUrl;
            copy.push(id);
            this.uploadList=fl;
            this.$emit('input', copy);

          }else {
            this.$message({message:p.info, type: 'warning'});
            this.uploadList.splice(fl.length,1);
            // this.clearFiles();
            return this.uploadList;
          }
        },
        onPreview (file) {
            window.location.href = file.downloadUrl;
        },
        handleUploadRemove (f) {
          const id = f.id;
          const v = this.value;
          let i = v.length;

          while(i--) {
            if(v[i] == id) break;
          }
          const copy = [...v];
          copy.splice(i, 1);
          this.$emit('input', copy);

        },
      },
      ceated () {
        this.uploadList = this.fileList;
      },
      watch:{
        'fileList':{
          handler(val){
            this.uploadList = val;
          },
        }
      }
    }
    </script>

    <!-- Add "scoped" attribute to limit CSS to this component only -->
    <style>

    </style>
    <style scoped lang="scss">
    </style>