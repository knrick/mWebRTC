<div id="message_section">
    <div>
        Пожалуйста, оставьте номер телефона и сообщение и мы вам перезвоним.
    </div>
    <table>
        <tr>
            <td>
                <label>Номер телефона:</label>
            </td>
            <td>
                <input maxlength=11 type="tel" id="message_phone" required></input><!-- by default the client has to type his phone number here to send callback message -->
            </td>
        </tr>
        <tr>
            <td>
                <label>Оставьте сообщение:</label>
            </td>
            <td>
                <textarea maxlength=300 id="message_text" placeholder="Оставьте сообщение"></textarea> <!-- by default the client can leave his message here to send callback message -->
            </td>
        </tr>
        <tr>
            <td>
                <button type="button" class="btn btn-danger" id="message_submit" onclick={sendCallbackMessage()}>Отправить</button> <!-- by default this button sends callback message -->
            </td>
        </tr>
    </table>
</div>