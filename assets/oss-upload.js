document.addEventListener('DOMContentLoaded', function() {
    // OSS上传对话框
    const ossUploadModal = document.getElementById('ossUpload');
    if (!ossUploadModal) {
        console.warn('OSS upload modal not found');
        return;
    }

    const ossUploadForm = ossUploadModal.querySelector('.modal-content form');
    const submitButton = ossUploadForm.querySelector('button[type="submit"]');

    // 监听表单提交
    ossUploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 上传中...';

        try {
            // 获取选中的文件列表
            const selectedFiles = [];
            document.querySelectorAll('.multi-select:checked').forEach(checkbox => {
                selectedFiles.push({
                    name: checkbox.dataset.select,
                    type: checkbox.dataset.selectType,
                    size: checkbox.dataset.selectSize
                });
            });
            
            // 创建 FormData 并添加数据
            const formData = new FormData();
            formData.append('bucket', document.getElementById('oss-bucket').value);
            formData.append('endpoint', document.getElementById('oss-endpoint').value);
            formData.append('path', document.getElementById('oss-path').value);
            formData.append('files', JSON.stringify(selectedFiles.map(f => f.name)));

            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                // 上传成功后刷新页面
                window.location.reload();
            } else {
                alert('上传失败: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('上传出错: ' + error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = '上传';
        }
    });

    // 当对话框打开时重置表单
    ossUploadModal.addEventListener('show.bs.modal', function() {
        ossUploadForm.reset();
    });
}); 