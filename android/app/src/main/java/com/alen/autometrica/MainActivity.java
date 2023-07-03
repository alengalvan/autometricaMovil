package com.alen.autometrica;
import android.view.WindowManager.LayoutParams;
import com.getcapacitor.BridgeActivity;

// import com.getcapacitor.community.database.sqlite.CapacitorSQLite;
// import android.os.Bundle;
// import com.getcapacitor.BridgeActivity;
// import com.getcapacitor.Plugin;
// import java.util.ArrayList;

public class MainActivity extends BridgeActivity {

  @Override
  public void onWindowFocusChanged(boolean isFocused) {
    if (isFocused) {
      getWindow().setFlags(LayoutParams.FLAG_SECURE, LayoutParams.FLAG_SECURE);
    } else {
      getWindow().setFlags(LayoutParams.FLAG_SECURE, LayoutParams.FLAG_SECURE);
    }
  }


// @Override
//   public void onCreate(Bundle savedInstanceState) {
//     super.onCreate(savedInstanceState);

//     // Initializes the Bridge
//     this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
//       // Additional plugins you've installed go here
//       add(CapacitorSQLite.class);
//     }});
//   }

}
