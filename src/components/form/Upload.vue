    <template>
      <el-upload
      :on-success="handleUploadSuccess"
      :on-remove="handleUploadRemove"
      :on-change="handleChange"
      class="app-upload"
      :action="action"
      :on-preview="onPreview"
      :before-upload="handleUploadBefore"
      :file-list="fileList"
      :multiple="multiple"
      :data="data"
      ref="upload"
    >           <!-- <i class="el-icon-upload"></i> -->
        <el-button size="small" type="primary">点击上传</el-button>
        <div class="el-upload__tip" slot="tip"><slot></slot></div>
    </el-upload>
    </template>

    <script>
    export default {
      name: 'upload',
      props: {
        'value': null,
        'fileList': {
            type: Array,
            default () {
              return [];
            }
        },
        'uploadText': String,
        'multiple': {
          type: Boolean,
          default: true,  
        },
        'action': {
          type: String,
          default: '/api/files',
        },
        'data': {
          type: Object,
          default () {
            return {};
          }
        }
      },
      data () {
        return {};
      },
      methods: {
        getFileList () {
          return this.$refs.upload.uploadFiles;
        },
        clearFiles () {
          this.$refs.upload.clearFiles();
        },
        handleUploadBefore (f) {
          this.$emit('beforeUpload');
          if (f.size > 200*1024*1024) {
            this.$message({type: 'warning',message:'上传文件大小不能超过200M！'});
            return false;
          }else {
            return true;
          }
        },
        handleUploadSuccess (p, f, list) {
          if(p.status) {
            const id = p.data.file.id;
            let copy;
            if(this.multiple) {
              copy = [...this.value];
              copy.push(id);
            }else {
              copy = id;
            }
            
            
            f.id = id;
            f.downloadUrl = p.data.file.downloadUrl;
            this.$emit('uploadSuccess', p, f, list);
            this.$emit('input', copy);

          }else {
            this.$message({message: p.info, type: 'warning'});
          }
        },
        onPreview (file) {
            window.location.href = file.downloadUrl;
        },
        handleUploadRemove (f) {
          const id = f.id;
          const v = this.value;

          let copy;

          if(this.multiple) {
            let i = v.length;
            while(i--) {
              if(v[i] == id) break;
            }
            copy = [...v];
            copy.splice(i, 1); 
          }else {
            copy = "";
          }

          this.$emit('input', copy);

        },
        handleChange (file, list) {
          if(file.response && !file.response.status) {
            list.pop();
          }
          // if( !file.response.status ) {
          //   list.pop();
          // }
        }
      }
    }
    </script>

    <!-- Add "scoped" attribute to limit CSS to this component only -->
    <style>

    </style>
    <style scoped lang="scss">
    </style>