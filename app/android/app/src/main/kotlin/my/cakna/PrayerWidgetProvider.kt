package my.cakna

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.res.Configuration
import android.widget.RemoteViews
import es.antonborri.home_widget.HomeWidgetPlugin
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/// Home-screen prayer-times widget. Data is written by the Flutter side
/// (PrayerWidgetService) for today ("w_") and tomorrow ("w2_"); onUpdate fires
/// every 30 min (updatePeriodMillis) and picks the set matching the current
/// date so the widget rolls over at midnight without the app being opened.
/// The theme pref selects the light/dark layout (0 = follow system).
class PrayerWidgetProvider : AppWidgetProvider() {
    override fun onUpdate(context: Context, mgr: AppWidgetManager, ids: IntArray) {
        val data = HomeWidgetPlugin.getData(context)
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
        // fall back to today's set when neither day matches (very stale data)
        val p = if (data.getString("w_day", "") != today &&
            data.getString("w2_day", "") == today) "w2_" else "w_"

        val theme = data.getInt("w_theme", 0)
        val night = when (theme) {
            1 -> false
            2 -> true
            else -> (context.resources.configuration.uiMode and
                    Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES
        }
        val layout = if (night) R.layout.prayer_widget_dark else R.layout.prayer_widget
        for (id in ids) {
            val views = RemoteViews(context.packageName, layout)
            views.setTextViewText(R.id.w_zone, data.getString("w_zone", "Cakna"))
            views.setTextViewText(R.id.w_date, data.getString("${p}date", ""))
            views.setTextViewText(R.id.w_subuh, data.getString("${p}subuh", "--:--"))
            views.setTextViewText(R.id.w_syuruk, data.getString("${p}syuruk", "--:--"))
            views.setTextViewText(R.id.w_zohor, data.getString("${p}zohor", "--:--"))
            views.setTextViewText(R.id.w_asar, data.getString("${p}asar", "--:--"))
            views.setTextViewText(R.id.w_maghrib, data.getString("${p}maghrib", "--:--"))
            views.setTextViewText(R.id.w_isyak, data.getString("${p}isyak", "--:--"))
            context.packageManager.getLaunchIntentForPackage(context.packageName)?.let {
                views.setOnClickPendingIntent(
                    R.id.w_root,
                    PendingIntent.getActivity(context, 0, it, PendingIntent.FLAG_IMMUTABLE)
                )
            }
            mgr.updateAppWidget(id, views)
        }
    }
}
