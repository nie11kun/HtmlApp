// 输入校验 / 计算失败的行内提示，代替浏览器 alert()
export default function Notice({ msg }: { msg: string }) {
    if (!msg) return null;
    return (
        <p className="calc-error" role="alert">
            <i className="fas fa-triangle-exclamation" aria-hidden="true"></i>
            <span>{msg}</span>
        </p>
    );
}
